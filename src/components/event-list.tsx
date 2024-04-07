import { ChangeEvent, useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import 'dayjs/locale/pt-br'

import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { api } from '../server/api'
import attendees from '../pages/attendees'

interface Event {
  id: number
  slug: string
  title: string
  details: string
  maximum_attendee: number
  attendee_registered: number
}

export function EventList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('query')) {
      return url.searchParams.get('query') ?? ''
    }

    return ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [events, setEvents] = useState<Event[]>([])
  // const [totalItems, setTotalItems] = useState(0)
  const totalItems = events.length
  const totalPages = Math.ceil(totalItems / 10)

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('search', String(page))

    window.history.pushState({}, '', url)
    setSearch(search)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)
    setPage(page)
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    if (page <= 1) {
      return
    }

    setCurrentPage(page - 1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  function goToFirstPage() {
    setCurrentPage(1)
  }

  useEffect(() => {
    api
      .get(`/events?page=${page}&query=${search}`)
      .then((response) => setEvents(response.data.events))
  }, [page, search])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-xl">Eventos</h1>

        <div className="w-72 px-3 py-1.5 border border-white/10 rounded-lg flex items-center gap-3 focus-within:ring-1 focus-within:ring-emerald-300">
          <Search className="size-4 text-emerald-300" />
          <input
            type="text"
            value={search}
            placeholder="Buscar eventos..."
            className="bg-transparent flex-1 outline-none h-auto border-0 p-0 text-sm focus:ring-0"
            onChange={onSearchInputChanged}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader>Evento</TableHeader>
            <TableHeader>Descrição</TableHeader>
            <TableHeader>Participantes registrados</TableHeader>
            <TableHeader>Total de Ingressos</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => {
            return (
              <TableRow
                key={event.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <TableCell>
                  <a href={event.slug}>{event.title}</a>
                </TableCell>

                <TableCell>
                  {!event.details ? 'Sem descrição' : event.details}
                </TableCell>

                <TableCell>{event.attendee_registered}</TableCell>

                <TableCell>
                  {!event.maximum_attendee ? (
                    <span className="text-4xl text-zinc-500">∞</span>
                  ) : (
                    event.maximum_attendee
                  )}
                </TableCell>

                <TableCell>
                  <IconButton transparent={true}>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {totalItems} items
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page <= 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>

                  <IconButton onClick={goToPreviousPage} disabled={page <= 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>

                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>

                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
