package com.callcalendar;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.lenient;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class DeleteEventTypeRaceApiTest {

  private static final Instant NOW = Instant.parse("2026-01-20T09:00:00Z");

  @Autowired private RestTestClient client;

  @MockitoBean private Clock clock;

  @MockitoSpyBean private BookingStore bookingStore;

  @Test
  @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
  void parallelDeleteAndBookingNeverLeaveBookingForDeletedType() throws Exception {
    lenient().when(clock.instant()).thenReturn(NOW);
    CountDownLatch checkStarted = new CountDownLatch(1);
    CountDownLatch finishDelete = new CountDownLatch(1);
    CountDownLatch bookingReserved = new CountDownLatch(1);

    doAnswer(
            invocation -> {
              boolean hasUpcoming = (boolean) invocation.callRealMethod();
              checkStarted.countDown();
              assertThat(finishDelete.await(10, TimeUnit.SECONDS)).isTrue();
              return hasUpcoming;
            })
        .when(bookingStore)
        .hasUpcomingFor(anyString(), any(LocalDateTime.class));

    doAnswer(
            invocation -> {
              boolean reserved = (boolean) invocation.callRealMethod();
              if (reserved) {
                bookingReserved.countDown();
              }
              return reserved;
            })
        .when(bookingStore)
        .reserve(any(Booking.class), any());

    ExecutorService executor = Executors.newFixedThreadPool(2);
    AtomicBoolean deleted = new AtomicBoolean();
    AtomicBoolean booked = new AtomicBoolean();
    try {
      Future<?> deleteRequest =
          executor.submit(() -> {
            client
                .delete()
                .uri("/event-types/consultation")
                .exchange()
                .expectStatus()
                .isNoContent();
            deleted.set(true);
          });
      assertThat(checkStarted.await(10, TimeUnit.SECONDS)).isTrue();

      Future<?> bookingRequest =
          executor.submit(() -> {
            try {
              client
                  .post()
                  .uri("/bookings")
                  .body(
                      Map.of(
                          "eventTypeId",
                          "consultation",
                          "slotStart",
                          "2026-01-21T10:00:00",
                          "guestName",
                          "Александр",
                          "guestEmail",
                          "guest@example.com"))
                  .exchange()
                  .expectStatus()
                  .isCreated();
              booked.set(true);
            } catch (AssertionError ignored) {
              booked.set(false);
            }
          });

      bookingReserved.await(1, TimeUnit.SECONDS);
      finishDelete.countDown();
      deleteRequest.get(10, TimeUnit.SECONDS);
      bookingRequest.get(10, TimeUnit.SECONDS);
    } finally {
      finishDelete.countDown();
      executor.shutdownNow();
    }

    assertThat(deleted).isTrue();
    assertThat(booked).isFalse();
    client.get().uri("/event-types/consultation").exchange().expectStatus().isNotFound();
    client
        .get()
        .uri("/bookings")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$[?(@.eventTypeId == 'consultation')]")
        .isEmpty();
  }
}
