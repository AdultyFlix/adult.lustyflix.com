"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  image: string
}

interface GenrePageProps {
  params: Promise<{ name: string }>
}

export default function GenrePage({ params }: GenrePageProps) {
  const [name, setName] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadData = async () => {
      const { name: genreName } = await params
      setName(genreName)

      try {
        const response = await fetch(`/api/discover?genre=${genreName}&page=${currentPage}`)
        const data = await response.json()
        setMovies(data.results)
        setTotalPages(data.totalPages || 500)
      } catch (error) {
        console.error("Failed to fetch genre movies:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentPage, params])

  const genre = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border bg-card/50 py-8 px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{genre}</h1>
        <p className="text-muted-foreground">
          {loading ? "Loading..." : `Explore our collection of ${genre.toLowerCase()} titles - Page ${currentPage}`}
        </p>
      </div>

      {/* Filters and Content */}
      <div className="px-4 md:px-6 py-8">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Sort By
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{movies.length} results</p>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-full h-60 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {movies.map((movie) => (
              <div key={movie.id}>
                <MovieCard {...movie} size="large" />
              </div>
            ))}
          </div>
        )}

        {/* Pagination controls at the bottom */}
        {!loading && movies.length > 0 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {/* Previous */}
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => p - 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    />
                  </PaginationItem>
                )}

                {/* Page Numbers */}
                {(() => {
                  const maxPagesToShow = 5
                  const half = Math.floor(maxPagesToShow / 2)

                  let start = Math.max(1, currentPage - half)
                  let end = start + maxPagesToShow - 1

                  if (end > totalPages) {
                    end = totalPages
                    start = Math.max(1, end - maxPagesToShow + 1)
                  }

                  return Array.from({ length: end - start + 1 }, (_, i) => {
                    const page = start + i
                    const isActive = page === currentPage

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={isActive}
                          href={isActive ? undefined : "#"}
                          className={isActive ? "pointer-events-none cursor-default opacity-70" : ""}
                          onClick={(e) => {
                            if (isActive) return
                            e.preventDefault()
                            setCurrentPage(page)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })
                })()}

                {/* Next */}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => p + 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
