package com.callcalendar;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.client.RestTestClient;

/**
 * Интеграционный тест шва HTTP API: DELETE /event-types/{id} блокируется 409 { code:
 * "EVENT_TYPE_IN_USE" }, пока у Типа встречи есть предстоящие Записи (старт не раньше now, та же
 * семантика, что у GET /bookings); прошедшие Записи удалению не мешают.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class DeleteEventTypesInUseApiTest {

  /** «Сейчас» для всех сценариев: 20 января 2026, 12:00 Europe/Moscow. */
  private static final Instant NOW = Instant.parse("2026-01-20T09:00:00Z");

  @Autowired private RestTestClient client;

  @Autowired private BookingStore bookingStore;

  @MockitoBean private Clock clock;

  private void nowIs(Instant now) {
    lenient().when(clock.instant()).thenReturn(now);
  }

  @Test
  @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
  void deleteIsBlockedWithConflictWhenEventTypeHasUpcomingBooking() {
    nowIs(NOW);
    booking("consultation", "2026-01-21T10:00:00");

    client
        .delete()
        .uri("/event-types/consultation")
        .exchange()
        .expectStatus()
        .isEqualTo(409)
        .expectBody()
        .jsonPath("$.code")
        .isEqualTo("EVENT_TYPE_IN_USE")
        .jsonPath("$.message")
        .isNotEmpty();

    client
        .get()
        .uri("/event-types")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$[?(@.id == 'consultation')]")
        .isNotEmpty();
  }

  @Test
  @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
  void deleteIsAllowedWhenOnlyPastBookingsExist() {
    nowIs(NOW);
    seedPastBooking("consultation", "2026-01-19T10:00:00");

    client.delete().uri("/event-types/consultation").exchange().expectStatus().isNoContent();

    client
        .get()
        .uri("/event-types")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$[?(@.id == 'consultation')]")
        .isEmpty();
  }

  /** Тестовая фикстура: заносит прошедшую Запись напрямую в store, минуя валидацию POST. */
  private void seedPastBooking(String eventTypeId, String slotStart) {
    Booking past =
        new Booking(
            "past-1",
            eventTypeId,
            LocalDateTime.parse(slotStart, SlotService.START_FORMAT),
            "Мария",
            "past-guest@example.com");
    boolean reserved = bookingStore.reserve(past, Duration.ofMinutes(30));
    assertThat(reserved)
        .as("фикстура: прошедшая Запись должна сохраниться без конфликтов")
        .isTrue();
  }

  private void booking(String eventTypeId, String slotStart) {
    client
        .post()
        .uri("/bookings")
        .body(
            Map.of(
                "eventTypeId",
                eventTypeId,
                "slotStart",
                slotStart,
                "guestName",
                "Александр",
                "guestEmail",
                "guest@example.com"))
        .exchange()
        .expectStatus()
        .isCreated();
  }
}
