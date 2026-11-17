import { render, screen, userEvent, within } from '../../test-utils'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBooking, listEventTypes, listSlots } from '../shared/api'
import type { Booking, EventType, Slot } from '../shared/api'
import { SlotCalendarPage } from './SlotCalendarPage'

vi.mock('../shared/api', () => ({
  createBooking: vi.fn(),
  listEventTypes: vi.fn(),
  listSlots: vi.fn(),
}))

const listEventTypesMock = vi.mocked(listEventTypes)
const listSlotsMock = vi.mocked(listSlots)
const createBookingMock = vi.mocked(createBooking)

const eventType: EventType = {
  id: 'consultation',
  title: 'Консультация',
  description: 'Разбор вопроса или задачи в течение получаса.',
  durationMinutes: 30,
}

const slots: Slot[] = [
  { start: '2026-03-02T09:00:00', available: true },
  { start: '2026-03-02T09:30:00', available: true },
  { start: '2026-03-02T10:00:00', available: false },
  { start: '2026-03-02T10:30:00', available: true },
]

function renderCalendarPage() {
  return render(
    <Routes>
      <Route path="/booking/:eventTypeId" element={<SlotCalendarPage />} />
    </Routes>,
    { route: '/booking/consultation' },
  )
}

describe('SlotCalendarPage', () => {
  beforeEach(() => {
    listEventTypesMock.mockReset()
    listSlotsMock.mockReset()
    createBookingMock.mockReset()
  })

  async function renderPageWithSelection() {
    listEventTypesMock.mockResolvedValue({
      data: [eventType],
    } as Awaited<ReturnType<typeof listEventTypes>>)
    listSlotsMock.mockResolvedValue({ data: slots } as Awaited<ReturnType<typeof listSlots>>)
    renderCalendarPage()
    await userEvent.click(await screen.findByRole('button', { name: '09:00' }))
  }

  it('renders the 14-day window and the slot grid fetched through the generated SDK', async () => {
    listEventTypesMock.mockResolvedValue({
      data: [eventType],
    } as Awaited<ReturnType<typeof listEventTypes>>)
    listSlotsMock.mockResolvedValue({ data: slots } as Awaited<ReturnType<typeof listSlots>>)
    renderCalendarPage()

    expect(await screen.findByRole('heading', { name: /Консультация/ })).toBeInTheDocument()

    const days = screen.getByRole('group', { name: 'Дни записи' })
    expect(within(days).getAllByRole('button')).toHaveLength(14)
    expect(listSlotsMock).toHaveBeenCalledWith({
      query: { eventTypeId: 'consultation', date: expect.any(String) },
    })

    expect(await screen.findByRole('button', { name: '09:00' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '10:00' })).toBeDisabled()
  })

  it('initial slot fetch asks for today in Europe/Moscow, not the browser timezone', async () => {
    // Момент, когда в Москве уже 5 марта, а в браузерной зоне (UTC-5) ещё 4 марта
    vi.useFakeTimers({
      now: new Date('2026-03-04T18:00:00-05:00'),
      shouldAdvanceTime: true,
    })
    listEventTypesMock.mockResolvedValue({
      data: [eventType],
    } as Awaited<ReturnType<typeof listEventTypes>>)
    listSlotsMock.mockResolvedValue({ data: [] as Slot[] } as Awaited<ReturnType<typeof listSlots>>)
    renderCalendarPage()
    await screen.findByRole('heading', { name: /Консультация/ })
    vi.useRealTimers()

    expect(listSlotsMock).toHaveBeenCalledWith({
      query: { eventTypeId: 'consultation', date: '2026-03-05' },
    })
  })

  it('clicking an available slot selects it', async () => {
    listEventTypesMock.mockResolvedValue({
      data: [eventType],
    } as Awaited<ReturnType<typeof listEventTypes>>)
    listSlotsMock.mockResolvedValue({ data: slots } as Awaited<ReturnType<typeof listSlots>>)
    renderCalendarPage()

    await userEvent.click(await screen.findByRole('button', { name: '09:00' }))

    expect(screen.getByRole('button', { name: '09:00' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Выбрано время: 09:00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10:00' })).toBeDisabled()
  })

  it('submit stays disabled until a slot is selected', async () => {
    listEventTypesMock.mockResolvedValue({
      data: [eventType],
    } as Awaited<ReturnType<typeof listEventTypes>>)
    listSlotsMock.mockResolvedValue({ data: slots } as Awaited<ReturnType<typeof listSlots>>)
    renderCalendarPage()
    await screen.findByRole('button', { name: '09:00' })

    expect(screen.getByRole('button', { name: 'Записаться' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: '09:00' }))

    expect(screen.getByRole('button', { name: 'Записаться' })).toBeEnabled()
  })

  it('booking a selected slot posts through the SDK and shows inline confirmation', async () => {
    const booking: Booking = {
      id: 'booking-1',
      eventTypeId: 'consultation',
      slotStart: slots[0].start,
      guestName: 'Александр',
      guestEmail: 'guest@example.com',
    }
    createBookingMock.mockResolvedValue({
      data: booking,
    } as Awaited<ReturnType<typeof createBooking>>)
    await renderPageWithSelection()
    await userEvent.type(screen.getByLabelText('Имя'), 'Александр')
    await userEvent.type(screen.getByLabelText('Email'), 'guest@example.com')

    await userEvent.click(screen.getByRole('button', { name: 'Записаться' }))

    expect(createBookingMock).toHaveBeenCalledWith({
      body: {
        eventTypeId: 'consultation',
        slotStart: '2026-03-02T09:00:00',
        guestName: 'Александр',
        guestEmail: 'guest@example.com',
      },
    })
    const confirmation = await screen.findByRole('status')
    expect(confirmation).toHaveTextContent('Вы записаны: Консультация, 09:00')
  })

  it('slot taken error shows a friendly message and refreshes the slot grid', async () => {
    createBookingMock.mockResolvedValue({
      error: { code: 'SLOT_TAKEN', message: 'Это время уже занято, выберите другое' },
    } as Awaited<ReturnType<typeof createBooking>>)
    await renderPageWithSelection()
    await userEvent.type(screen.getByLabelText('Имя'), 'Александр')
    await userEvent.type(screen.getByLabelText('Email'), 'guest@example.com')

    await userEvent.click(screen.getByRole('button', { name: 'Записаться' }))

    expect(await screen.findByText('Это время уже занято, выберите другое')).toBeInTheDocument()
    expect(listSlotsMock).toHaveBeenCalledTimes(2)
  })

  it('data error message is shown without refreshing the slot grid', async () => {
    createBookingMock.mockResolvedValue({
      error: { code: 'INVALID_GUEST_EMAIL', message: 'Некорректный email' },
    } as Awaited<ReturnType<typeof createBooking>>)
    await renderPageWithSelection()
    await userEvent.type(screen.getByLabelText('Имя'), 'Александр')
    await userEvent.type(screen.getByLabelText('Email'), 'guest@example.com')

    await userEvent.click(screen.getByRole('button', { name: 'Записаться' }))

    expect(await screen.findByText('Некорректный email')).toBeInTheDocument()
    expect(listSlotsMock).toHaveBeenCalledTimes(1)
  })

  it('shows an error and no calendar when loading event types fails', async () => {
    listEventTypesMock.mockResolvedValue({
      error: new Error('network error'),
    } as Awaited<ReturnType<typeof listEventTypes>>)
    renderCalendarPage()

    expect(await screen.findByText('Не удалось загрузить типы встреч')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Дни записи' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '09:00' })).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(listSlotsMock).not.toHaveBeenCalled()
  })

  it('shows a friendly message when the linked event type no longer exists', async () => {
    listEventTypesMock.mockResolvedValue({
      data: [
        {
          id: 'greeting',
          title: 'Знакомство',
          description: 'Короткий звонок, чтобы познакомиться.',
          durationMinutes: 15,
        },
      ],
    } as Awaited<ReturnType<typeof listEventTypes>>)
    renderCalendarPage()

    expect(
      await screen.findByText('Этот тип встреч больше не доступен для записи'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Дни записи' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Имя')).not.toBeInTheDocument()
    expect(listSlotsMock).not.toHaveBeenCalled()
  })
})
