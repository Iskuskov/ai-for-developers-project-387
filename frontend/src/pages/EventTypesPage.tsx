import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { createEventType, deleteEventType, listEventTypes } from '../shared/api'
import type { EventType } from '../shared/api'
import { EventTypeCard } from '../shared/EventTypeCard'
import { AppHeader } from '../shared/AppHeader'
import { useApi } from '../shared/useApi'

export function EventTypesPage() {
  const { data: fetchedTypes, hasError } = useApi(listEventTypes, [])
  // Созданные владельцем Типы встреч добавляются к загруженному списку без повторного запроса
  const [createdTypes, setCreatedTypes] = useState<EventType[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const eventTypes = [...(fetchedTypes ?? []), ...createdTypes].filter(
    (eventType) => !removedIds.includes(eventType.id),
  )
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingType, setDeletingType] = useState<EventType | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    const result = await createEventType({
      body: { title, description, durationMinutes: Number(durationMinutes) },
    })
    if (result.error) {
      setFormError(result.error.message)
      return
    }
    const created = result.data
    if (created) {
      setCreatedTypes((current) => [...current, created])
      setTitle('')
      setDescription('')
      setDurationMinutes('')
    }
  }

  function openDeleteModal(eventType: EventType) {
    setDeleteError(null)
    setDeletingType(eventType)
  }

  function closeDeleteModal() {
    if (isDeleting) return
    setDeletingType(null)
    setDeleteError(null)
  }

  async function handleDelete() {
    const id = deletingType?.id
    if (!id) return
    setIsDeleting(true)
    setDeleteError(null)
    const result = await deleteEventType({ path: { id } })
    setIsDeleting(false)
    if (result.error) {
      setDeleteError(result.error.message)
      return
    }
    setRemovedIds((current) => [...current, id])
    setDeletingType(null)
  }

  return (
    <Box mih="100vh" bg="gray.0">
      <AppHeader />
      <Container size="sm" py="xl">
        <Stack gap="md">
          <Title order={2}>Типы встреч</Title>
          {hasError && <Text c="red">Не удалось загрузить типы встреч</Text>}
          {!hasError && fetchedTypes === null && (
            <Group justify="center" py="xl">
              <Loader size="sm" />
            </Group>
          )}
          {!hasError && fetchedTypes !== null && (
            <Stack gap="sm">
              {eventTypes.map((eventType) => (
                <EventTypeCard key={eventType.id} eventType={eventType}>
                  <Group justify="flex-end">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      aria-label="Удалить"
                      disabled={isDeleting}
                      onClick={() => openDeleteModal(eventType)}
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v5M14 11v5" />
                      </svg>
                    </ActionIcon>
                  </Group>
                </EventTypeCard>
              ))}
            </Stack>
          )}
          <Divider />
          <Title order={3}>Новый тип встречи</Title>
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput
                label="Название"
                placeholder="Знакомство"
                value={title}
                onChange={(change) => setTitle(change.currentTarget.value)}
              />
              <Textarea
                label="Описание"
                placeholder="Короткий звонок, чтобы познакомиться."
                value={description}
                onChange={(change) => setDescription(change.currentTarget.value)}
              />
              <NumberInput
                label="Длительность, минут"
                placeholder="30"
                value={durationMinutes}
                onChange={(change) => setDurationMinutes(String(change ?? ''))}
              />
              {formError && <Text c="red">{formError}</Text>}
              <Button type="submit" w="fit-content">
                Создать
              </Button>
            </Stack>
          </form>
          <Divider />
          <Anchor component={Link} to="/" size="sm">
            ← На главную
          </Anchor>
        </Stack>
      </Container>
      <Modal
        opened={deletingType !== null}
        onClose={closeDeleteModal}
        title="Удалить тип встречи?"
        centered
      >
        <Stack gap="md">
          <Text>Тип «{deletingType?.title}» будет удалён насовсем. Отменить это будет нельзя.</Text>
          {deleteError && <Text c="red">{deleteError}</Text>}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal} disabled={isDeleting}>
              Отмена
            </Button>
            <Button color="red" onClick={handleDelete} loading={isDeleting} disabled={isDeleting}>
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
