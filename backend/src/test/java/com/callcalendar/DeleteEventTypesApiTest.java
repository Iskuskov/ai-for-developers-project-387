package com.callcalendar;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class DeleteEventTypesApiTest {

  @Autowired private RestTestClient client;

  @Test
  void deleteEventTypeReturns204AndRemovesItFromList() {
    client.delete().uri("/event-types/greeting").exchange().expectStatus().isNoContent();

    client
        .get()
        .uri("/event-types")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$.length()")
        .isEqualTo(2)
        .jsonPath("$[0].id")
        .isEqualTo("consultation")
        .jsonPath("$[1].id")
        .isEqualTo("code-review");

    client.delete().uri("/event-types/greeting").exchange().expectStatus().isNotFound();
  }

  @Test
  void deleteUnknownEventTypeReturns404WithUnifiedErrorBody() {
    client
        .delete()
        .uri("/event-types/nope")
        .exchange()
        .expectStatus()
        .isNotFound()
        .expectBody()
        .jsonPath("$.code")
        .isEqualTo("EVENT_TYPE_NOT_FOUND")
        .jsonPath("$.message")
        .isNotEmpty();
  }
}
