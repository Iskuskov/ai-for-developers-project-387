package com.callcalendar;

/** Тип встречи нельзя удалить: у него есть предстоящие Записи. */
public class EventTypeInUseException extends RuntimeException {

  EventTypeInUseException() {
    super("Нельзя удалить тип встречи: на него есть предстоящие записи");
  }
}
