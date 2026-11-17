import userEvent from '@testing-library/user-event'
import { render, screen, within } from '../../test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEventType, deleteEventType, listEventTypes } from '../shared/api'
import type { EventType } from '../shared/api'
import { EventTypesPage } from './EventTypesPage'

vi.mock('../shared/api', () => ({
  listEventTypes: vi.fn(),
  createEventType: vi.fn(),
  deleteEventType: vi.fn(),
}))

const listEventTypesMock = vi.mocked(listEventTypes)
const createEventTypeMock = vi.mocked(createEventType)
const deleteEventTypeMock = vi.mocked(deleteEventType)

const seed: EventType[] = [
  {
    id: 'greeting',
    title: 'Знакомство',
    description: 'Короткий звонок, чтобы познакомиться и понять, чем можно помочь.',
    durationMinutes: 15,
  },
]

describe('EventTypesPage', () => {
  beforeEach(() => {
    listEventTypesMock.mockReset()
    createEventTypeMock.mockReset()
    deleteEventTypeMock.mockReset()
    listEventTypesMock.mockResolvedValue({ data: seed } as Awaited<
      ReturnType<typeof listEventTypes>
    >)
  })

  it('создаёт Тип встречи через сгенерированный SDK и показывает его в списке', async () => {
    const created: EventType = {
      id: 'new-1',
      title: 'Планирование',
      description: 'Совместное планирование задач.',
      durationMinutes: 45,
    }
    createEventTypeMock.mockResolvedValue({ data: created } as Awaited<
      ReturnType<typeof createEventType>
    >)
    const user = userEvent.setup()
    render(<EventTypesPage />)

    expect(await screen.findByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Название'), 'Планирование')
    await user.type(screen.getByLabelText('Описание'), 'Совместное планирование задач.')
    await user.type(screen.getByLabelText('Длительность, минут'), '45')
    await user.click(screen.getByRole('button', { name: 'Создать' }))

    expect(createEventTypeMock).toHaveBeenCalledWith({
      body: { title: 'Планирование', description: 'Совместное планирование задач.', durationMinutes: 45 },
    })
    expect(await screen.findByRole('heading', { name: 'Планирование' })).toBeInTheDocument()
    expect(screen.getByText('Длительность: 45 мин')).toBeInTheDocument()
  })

  it('показывает сообщение ошибки, когда сервер вернул 400', async () => {
    createEventTypeMock.mockResolvedValue({
      error: { code: 'VALIDATION_FAILED', message: 'Название не может быть пустым' },
    } as Awaited<ReturnType<typeof createEventType>>)
    const user = userEvent.setup()
    render(<EventTypesPage />)

    expect(await screen.findByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Создать' }))

    expect(await screen.findByText('Название не может быть пустым')).toBeInTheDocument()
  })

  it('удаляет Тип встречи после подтверждения и убирает его из списка без перезагрузки', async () => {
    deleteEventTypeMock.mockResolvedValue({} as Awaited<ReturnType<typeof deleteEventType>>)
    const user = userEvent.setup()
    render(<EventTypesPage />)

    expect(await screen.findByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Удалить тип встречи?')).toBeInTheDocument()
    expect(within(dialog).getByText(/будет удалён насовсем\. Отменить это будет нельзя\./)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }))

    expect(deleteEventTypeMock).toHaveBeenCalledWith({ path: { id: 'greeting' } })
    expect(screen.queryByRole('heading', { name: 'Знакомство' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(listEventTypesMock).toHaveBeenCalledTimes(1)
  })

  it('показывает ошибку 404 внутри открытой модалки и оставляет Тип в списке', async () => {
    deleteEventTypeMock.mockResolvedValue({
      error: { code: 'EVENT_TYPE_NOT_FOUND', message: 'Тип встречи не найден: greeting' },
    } as Awaited<ReturnType<typeof deleteEventType>>)
    const user = userEvent.setup()
    render(<EventTypesPage />)

    expect(await screen.findByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }))

    expect(await within(dialog).findByText('Тип встречи не найден: greeting')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()
  })

  it('показывает ошибку 409 внутри открытой модалки и оставляет Тип в списке', async () => {
    deleteEventTypeMock.mockResolvedValue({
      error: {
        code: 'EVENT_TYPE_IN_USE',
        message: 'Нельзя удалить тип встречи: на него есть предстоящие записи',
      },
    } as Awaited<ReturnType<typeof deleteEventType>>)
    const user = userEvent.setup()
    render(<EventTypesPage />)

    expect(await screen.findByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }))

    expect(
      await within(dialog).findByText(
        'Нельзя удалить тип встречи: на него есть предстоящие записи',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()
  })
})
