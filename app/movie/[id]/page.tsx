"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Share2, Heart } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import Link from "next/link"

interface MovieDetails {
  id: number
  title: string
  year: number
  rating: number
  image: string
  description: string
  longDescription: string
  duration: number
  director: string
  cast: string[]
  genres: string[]
}

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  image: string
}

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default function MoviePage({ params }: MoviePageProps) {
  const [id, setId] = useState("")
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const { id: movieId } = await params
      setId(movieId)

      try {
        const [movieRes, similarRes] = await Promise.all([
          fetch(`/api/movie/${movieId}`),
          fetch(`/api/similar/${movieId}`),
        ])

        if (movieRes.ok) {
          const movieData = await movieRes.json()
          setMovie(movieData)
        }

        if (similarRes.ok) {
          const similarData = await similarRes.json()
          setSimilarMovies(similarData.results.slice(0, 6))
        }
      } catch (error) {
        console.error("Failed to fetch movie:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-background">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full" />
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-background">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <p className="text-foreground text-lg">Movie not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-background">
      <Navigation />

      {/* Video Player Section */}
      <div className="w-full bg-black">
        <div className="relative w-full aspect-video bg-black group overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${movie.image}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-cyan-500 hover:bg-cyan-600 active:scale-95 transition-all duration-300 text-white rounded-full p-4 md:p-6 shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 transform"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between gap-3">
              {/* Progress Bar */}
              <div className="flex-1">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-cyan-500" />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-cyan-400 transition">
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
                <button className="text-white hover:text-cyan-400 transition">
                  <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title and Meta Info */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-6 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 text-balance">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2 bg-cyan-500/20 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full">
                    <span className="text-cyan-400 font-bold text-base md:text-lg">{movie.rating.toFixed(1)}</span>
                    <span className="text-cyan-300 hidden sm:inline">Rating</span>
                  </div>
                  <span className="text-slate-400">{movie.year}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{movie.duration} min</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 w-full">
                <Button
                  size="sm"
                  className="flex-1 md:flex-none bg-cyan-500 hover:bg-cyan-600 gap-2 rounded-lg md:px-6"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Watch Now</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-slate-600 hover:border-cyan-400 hover:text-cyan-400 rounded-lg"
                >
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-slate-600 hover:border-cyan-400 hover:text-cyan-400 rounded-lg"
                >
                  <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre: string) => (
                <Link key={genre} href={`/genre/${genre.toLowerCase()}`}>
                  <span className="text-xs bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full hover:from-cyan-500/50 hover:to-blue-500/50 transition cursor-pointer border border-cyan-500/30">
                    {genre}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 md:mb-12">
            <p className="text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {movie.description}
            </p>
          </div>

          {/* Cast and Crew */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Director</h3>
              <p className="text-base md:text-lg text-white font-medium">{movie.director}</p>
            </div>
            <div className="md:col-span-1 lg:col-span-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {movie.cast.map((actor: string) => (
                  <span
                    key={actor}
                    className="bg-slate-800/50 text-slate-300 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-12 md:mb-16 pb-12 md:pb-16 border-b border-slate-800">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">Overview</h2>
            <p className="text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {movie.longDescription}
            </p>
          </div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 md:mb-8">Similar Titles</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                {similarMovies.map((movie) => (
                  <div key={movie.id} className="group">
                    <MovieCard {...movie} size="default" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
