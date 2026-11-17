package com.callcalendar;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Просмотр и создание Типов встреч по контракту Call Calendar API. */
@RestController
@Tag(name = "EventTypes")
public class EventTypeController {

  private final EventTypeStore store;

  private final BookingOccupancy bookings;

  private final Clock clock;

  public EventTypeController(EventTypeStore store, BookingOccupancy bookings, Clock clock) {
    this.store = store;
    this.bookings = bookings;
    this.clock = clock;
  }

  @Operation(
      operationId = "listEventTypes",
      description = "Список типов встреч, доступных для записи.")
  @ApiResponse(
      responseCode = "200",
      description = "The request has succeeded.",
      useReturnTypeSchema = true)
  @GetMapping(value = "/event-types", produces = "application/json")
  public List<EventType> list() {
    return store.findAll();
  }

  @Operation(
      operationId = "getEventType",
      description = "Получение типа встречи по идентификатору.")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "The request has succeeded.",
        useReturnTypeSchema = true),
    @ApiResponse(
        responseCode = "404",
        description = "Тип встречи не найден.",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping(value = "/event-types/{id}", produces = "application/json")
  public EventType get(
      @PathVariable("id")
          @Parameter(
              in = ParameterIn.PATH,
              description = "Идентификатор типа встречи.",
              required = true)
          String id) {
    return store
        .findById(id)
        .orElseThrow(() -> new EventTypeNotFoundException(id, HttpStatus.NOT_FOUND));
  }

  @Operation(operationId = "createEventType", description = "Создание типа встречи владельцем.")
  @ApiResponse(
      responseCode = "201",
      description = "Созданный тип встречи.",
      useReturnTypeSchema = true)
  @ApiResponse(
      responseCode = "400",
      description = "Некорректные данные запроса.",
      content = @Content(schema = @Schema(implementation = ApiError.class)))
  @PostMapping(value = "/event-types", consumes = "application/json", produces = "application/json")
  @ResponseStatus(HttpStatus.CREATED)
  public EventType create(@Valid @RequestBody EventTypeInput input) {
    return store.create(input);
  }

  @Operation(operationId = "deleteEventType", description = "Удаление типа встречи владельцем.")
  @ApiResponses({
    @ApiResponse(responseCode = "204", description = "Тип встречи удалён."),
    @ApiResponse(
        responseCode = "404",
        description = "Тип встречи не найден.",
        content = @Content(schema = @Schema(implementation = ApiError.class))),
    @ApiResponse(
        responseCode = "409",
        description = "Тип встречи используется предстоящими записями.",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @DeleteMapping(value = "/event-types/{id}", produces = "application/json")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("id")
          @Parameter(
              in = ParameterIn.PATH,
              description = "Идентификатор типа встречи.",
              required = true)
          String id) {
    synchronized (bookings.reservationMonitor()) {
      if (store.findById(id).isEmpty()) {
        throw new EventTypeNotFoundException(id, HttpStatus.NOT_FOUND);
      }
      LocalDateTime now = clock.instant().atZone(SlotService.WORK_ZONE).toLocalDateTime();
      if (bookings.hasUpcomingFor(id, now)) {
        throw new EventTypeInUseException();
      }
      store.delete(id);
    }
  }
}
