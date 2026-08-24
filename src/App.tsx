import {
  Album,
  ArrowClockwise,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  DotsThree,
  GearSix,
  House,
  List,
  MagnifyingGlass,
  MusicNote,
  Pause,
  Play,
  Playlist,
  Queue,
  Repeat,
  RepeatOnce,
  Shuffle,
  SignOut,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSlash,
  UserCircle,
  Users,
  X,
} from '@phosphor-icons/react'
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type ViewName = 'home' | 'search' | 'library' | 'albums' | 'artists' | 'songs' | 'playlists' | 'album' | 'artist'

type Track = {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  art?: string
  audio?: string
  plays?: number
  year?: number
  index?: number
  key?: string
}

type AlbumItem = {
  id: string
  title: string
  artist: string
  year?: number
  genre?: string
  art?: string
  plays?: number
  key?: string
  addedAt?: number
}

type ArtistItem = {
  id: string
  title: string
  art?: string
  key?: string
}

type PlaylistItem = {
  id: string
  title: string
  subtitle?: string
  art?: string
  key?: string
}

type PlexConnection = {
  protocol?: string
  address?: string
  port?: number
  uri: string
  local?: boolean
  relay?: boolean
}

type PlexResource = {
  name: string
  provides?: string
  accessToken?: string
  owned?: boolean
  connections?: PlexConnection[]
}

type PlexState = {
  userToken: string
  serverToken: string
  serverUrl: string
  serverName: string
  sectionKey: string
  sectionTitle: string
}

const APP_NAME = 'Plex Music Prototype'
const CLIENT_ID_KEY = 'plex-music-client-id'
const PLEX_STATE_KEY = 'plex-music-state'

const gradients = [
  'linear-gradient(145deg,#ff7a59 0%,#d83b78 45%,#50248f 100%)',
  'linear-gradient(145deg,#0f7f75 0%,#205fb5 50%,#6a43b9 100%)',
  'linear-gradient(145deg,#f6c85f 0%,#ed553b 48%,#8f2d56 100%)',
  'linear-gradient(145deg,#2b5876 0%,#4e4376 100%)',
  'linear-gradient(145deg,#5b247a 0%,#1bcedf 100%)',
  'linear-gradient(145deg,#1f4037 0%,#99f2c8 100%)',
  'linear-gradient(145deg,#42275a 0%,#734b6d 100%)',
  'linear-gradient(145deg,#141e30 0%,#243b55 100%)',
  'linear-gradient(145deg,#93291e 0%,#ed213a 100%)',
]

const demoAlbums: AlbumItem[] = [
  { id: 'a1', title: 'After Midnight', artist: 'Nova Lane', year: 2026, genre: 'Alternative R&B', plays: 31 },
  { id: 'a2', title: 'Soft Focus', artist: 'Mira Vale', year: 2026, genre: 'Pop', plays: 24 },
  { id: 'a3', title: 'Signal Bloom', artist: 'Day Current', year: 2025, genre: 'Electronic', plays: 22 },
  { id: 'a4', title: 'Glass Rooms', artist: 'Aster', year: 2025, genre: 'Pop', plays: 19 },
  { id: 'a5', title: 'Sunday Static', artist: 'The Halos', year: 2024, genre: 'Indie Pop', plays: 17 },
  { id: 'a6', title: 'Blue Hour', artist: 'Mira Vale', year: 2024, genre: 'R&B', plays: 15 },
  { id: 'a7', title: 'Warm Machine', artist: 'Nova Lane', year: 2023, genre: 'Dance', plays: 13 },
  { id: 'a8', title: 'Open Late', artist: 'Day Current', year: 2023, genre: 'Electronic', plays: 11 },
]

const demoTracks: Track[] = [
  { id: 't1', title: 'Listen Before Dawn', artist: 'Nova Lane', album: 'After Midnight', duration: 12, audio: '/audio/demo-1.wav', plays: 18, year: 2026, index: 1 },
  { id: 't2', title: 'Soft Focus', artist: 'Mira Vale', album: 'Soft Focus', duration: 12, audio: '/audio/demo-2.wav', plays: 16, year: 2026, index: 2 },
  { id: 't3', title: 'I Hope I Sleep Tonight', artist: 'Day Current', album: 'Signal Bloom', duration: 12, audio: '/audio/demo-3.wav', plays: 14, year: 2025, index: 3 },
  { id: 't4', title: 'Slide', artist: 'Aster', album: 'Glass Rooms', duration: 12, audio: '/audio/demo-4.wav', plays: 12, year: 2025, index: 4 },
  { id: 't5', title: 'Palm Reader', artist: 'The Halos', album: 'Sunday Static', duration: 12, audio: '/audio/demo-5.wav', plays: 10, year: 2024, index: 5 },
  { id: 't6', title: 'Blue Hour', artist: 'Mira Vale', album: 'Blue Hour', duration: 12, audio: '/audio/demo-6.wav', plays: 9, year: 2024, index: 6 },
  { id: 't7', title: 'Neon Weather', artist: 'Nova Lane', album: 'Warm Machine', duration: 12, audio: '/audio/demo-7.wav', plays: 8, year: 2023, index: 7 },
  { id: 't8', title: 'Open Late', artist: 'Day Current', album: 'Open Late', duration: 12, audio: '/audio/demo-8.wav', plays: 7, year: 2023, index: 8 },
]

const demoArtists: ArtistItem[] = [
  { id: 'ar1', title: 'Nova Lane' },
  { id: 'ar2', title: 'Mira Vale' },
  { id: 'ar3', title: 'Day Current' },
  { id: 'ar4', title: 'Aster' },
  { id: 'ar5', title: 'The Halos' },
  { id: 'ar6', title: 'Violet Frame' },
]

const demoPlaylists: PlaylistItem[] = [
  { id: 'p1', title: 'Chart Toppers', subtitle: 'Nova Lane, Mira Vale, Day Current and more' },
  { id: 'p2', title: 'Focus Radio', subtitle: 'A low-key mix for getting things done' },
  { id: 'p3', title: 'Night Drive', subtitle: 'Electronic, R&B and pop after dark' },
  { id: 'p4', title: 'Discovery', subtitle: 'A rotating mix of things you may have missed' },
]

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = uid()
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

function durationLabel(seconds = 0) {
  if (!Number.isFinite(seconds)) return '0:00'
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${String(sec).padStart(2, '0')}`
}

function coverGradient(id: string) {
  let n = 0
  for (const c of id) n += c.charCodeAt(0)
  return gradients[n % gradients.length]
}

function Cover({ item, className = '', rounded = false }: { item: { id: string; title: string; art?: string }; className?: string; rounded?: boolean }) {
  return item.art ? (
    <img className={`cover ${rounded ? 'round' : ''} ${className}`} src={item.art} alt="" />
  ) : (
    <div className={`cover generated ${rounded ? 'round' : ''} ${className}`} style={{ background: coverGradient(item.id) }} aria-hidden="true">
      <span>{item.title.slice(0, 1).toUpperCase()}</span>
      <small>{item.title}</small>
    </div>
  )
}

function navLabel(view: ViewName) {
  if (view === 'home') return 'Home'
  if (view === 'search') return 'Search'
  if (view === 'library') return 'Library'
  if (view === 'albums') return 'Albums'
  if (view === 'artists') return 'Artists'
  if (view === 'songs') return 'Songs'
  if (view === 'playlists') return 'Playlists'
  if (view === 'album') return 'Album'
  return 'Artist'
}

function App() {
  const [view, setView] = useState<ViewName>('home')
  const [history, setHistory] = useState<ViewName[]>([])
  const [albums, setAlbums] = useState<AlbumItem[]>(demoAlbums)
  const [tracks, setTracks] = useState<Track[]>(demoTracks)
  const [artists, setArtists] = useState<ArtistItem[]>(demoArtists)
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(demoPlaylists)
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<ArtistItem | null>(null)
  const [detailTracks, setDetailTracks] = useState<Track[]>([])
  const [detailAlbums, setDetailAlbums] = useState<AlbumItem[]>([])
  const [query, setQuery] = useState('')
  const [queue, setQueue] = useState<Track[]>(demoTracks)
  const [queueOpen, setQueueOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track>(demoTracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(currentTrack.duration || 0)
  const [volume, setVolume] = useState(0.85)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<0 | 1 | 2>(0)
  const [plex, setPlex] = useState<PlexState | null>(() => {
    try {
      const raw = localStorage.getItem(PLEX_STATE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loadingPlex, setLoadingPlex] = useState(false)
  const [plexError, setPlexError] = useState('')
  const [serverChoices, setServerChoices] = useState<PlexResource[]>([])
  const [pendingUserToken, setPendingUserToken] = useState('')
  const [manualServerUrl, setManualServerUrl] = useState('')
  const [manualToken, setManualToken] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const go = useCallback((next: ViewName) => {
    setHistory(h => [...h.slice(-19), view])
    setView(next)
  }, [view])

  const goBack = () => {
    setHistory(h => {
      if (!h.length) return h
      const copy = [...h]
      const previous = copy.pop()!
      setView(previous)
      return copy
    })
  }

  const plexUrl = useCallback((path?: string, tokenOverride?: string) => {
    if (!plex || !path) return undefined
    if (/^https?:\/\//i.test(path)) return path
    const token = tokenOverride || plex.serverToken
    const separator = path.includes('?') ? '&' : '?'
    return `${plex.serverUrl.replace(/\/$/, '')}${path}${separator}X-Plex-Token=${encodeURIComponent(token)}`
  }, [plex])

  const fetchPlexJson = useCallback(async (path: string, state = plex) => {
    if (!state) throw new Error('Plex is not connected.')
    const url = `${state.serverUrl.replace(/\/$/, '')}${path}${path.includes('?') ? '&' : '?'}X-Plex-Token=${encodeURIComponent(state.serverToken)}`
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-Plex-Client-Identifier': getClientId(),
        'X-Plex-Product': APP_NAME,
      },
    })
    if (!response.ok) throw new Error(`Plex returned ${response.status}.`)
    return response.json()
  }, [plex])

  const metadataArray = (payload: any) => payload?.MediaContainer?.Metadata || []

  const mapAlbum = useCallback((m: any, state = plex): AlbumItem => ({
    id: String(m.ratingKey || m.key || uid()),
    title: m.title || 'Untitled Album',
    artist: m.parentTitle || m.grandparentTitle || 'Unknown Artist',
    year: Number(m.year) || undefined,
    genre: m.Genre?.[0]?.tag,
    art: state && m.thumb ? `${state.serverUrl.replace(/\/$/, '')}${m.thumb}?X-Plex-Token=${encodeURIComponent(state.serverToken)}` : undefined,
    plays: Number(m.viewCount) || 0,
    key: m.key,
    addedAt: Number(m.addedAt) || 0,
  }), [plex])

  const mapArtist = useCallback((m: any, state = plex): ArtistItem => ({
    id: String(m.ratingKey || m.key || uid()),
    title: m.title || 'Unknown Artist',
    art: state && (m.thumb || m.art) ? `${state.serverUrl.replace(/\/$/, '')}${m.thumb || m.art}?X-Plex-Token=${encodeURIComponent(state.serverToken)}` : undefined,
    key: m.key,
  }), [plex])

  const mapTrack = useCallback((m: any, state = plex): Track => {
    const part = m.Media?.[0]?.Part?.[0]
    return {
      id: String(m.ratingKey || m.key || uid()),
      title: m.title || 'Untitled Track',
      artist: m.grandparentTitle || m.originalTitle || 'Unknown Artist',
      album: m.parentTitle || 'Unknown Album',
      duration: Math.round((Number(m.duration) || 0) / 1000),
      art: state && (m.thumb || m.parentThumb || m.grandparentThumb) ? `${state.serverUrl.replace(/\/$/, '')}${m.thumb || m.parentThumb || m.grandparentThumb}?X-Plex-Token=${encodeURIComponent(state.serverToken)}` : undefined,
      audio: state && part?.key ? `${state.serverUrl.replace(/\/$/, '')}${part.key}?X-Plex-Token=${encodeURIComponent(state.serverToken)}` : undefined,
      plays: Number(m.viewCount) || 0,
      year: Number(m.year) || undefined,
      index: Number(m.index) || undefined,
      key: m.key,
    }
  }, [plex])

  const mapPlaylist = useCallback((m: any, state = plex): PlaylistItem => ({
    id: String(m.ratingKey || m.key || uid()),
    title: m.title || 'Untitled Playlist',
    subtitle: `${Number(m.leafCount) || 0} songs`,
    art: state && (m.composite || m.thumb) ? `${state.serverUrl.replace(/\/$/, '')}${m.composite || m.thumb}?X-Plex-Token=${encodeURIComponent(state.serverToken)}` : undefined,
    key: m.key,
  }), [plex])

  const loadPlexLibrary = useCallback(async (state: PlexState) => {
    setLoadingPlex(true)
    setPlexError('')
    try {
      const base = `/library/sections/${state.sectionKey}`
      const [albumPayload, artistPayload, trackPayload, playlistPayload] = await Promise.all([
        fetchPlexJson(`${base}/all?type=9&sort=addedAt:desc&X-Plex-Container-Start=0&X-Plex-Container-Size=100`, state),
        fetchPlexJson(`${base}/all?type=8&sort=titleSort&X-Plex-Container-Start=0&X-Plex-Container-Size=100`, state),
        fetchPlexJson(`${base}/all?type=10&sort=viewCount:desc&X-Plex-Container-Start=0&X-Plex-Container-Size=100`, state),
        fetchPlexJson(`/playlists?playlistType=audio&X-Plex-Container-Start=0&X-Plex-Container-Size=100`, state).catch(() => ({ MediaContainer: {} })),
      ])
      const nextAlbums = metadataArray(albumPayload).map((m: any) => mapAlbum(m, state))
      const nextArtists = metadataArray(artistPayload).map((m: any) => mapArtist(m, state))
      const nextTracks = metadataArray(trackPayload).map((m: any) => mapTrack(m, state))
      const nextPlaylists = metadataArray(playlistPayload).map((m: any) => mapPlaylist(m, state))
      setAlbums(nextAlbums.length ? nextAlbums : demoAlbums)
      setArtists(nextArtists.length ? nextArtists : demoArtists)
      setTracks(nextTracks.length ? nextTracks : demoTracks)
      setPlaylists(nextPlaylists.length ? nextPlaylists : demoPlaylists)
      if (nextTracks.length) {
        setQueue(nextTracks.slice(0, 40))
        setCurrentTrack(nextTracks[0])
      }
      setSettingsOpen(false)
    } catch (error) {
      setPlexError(error instanceof Error ? error.message : 'Could not load your Plex library.')
    } finally {
      setLoadingPlex(false)
    }
  }, [fetchPlexJson, mapAlbum, mapArtist, mapPlaylist, mapTrack])

  useEffect(() => {
    if (plex) loadPlexLibrary(plex)
  }, []) // intentionally load once from saved state

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.src !== new URL(currentTrack.audio || '', window.location.href).href && currentTrack.audio) {
      audio.src = currentTrack.audio
      audio.load()
      setCurrentTime(0)
      setDuration(currentTrack.duration || 0)
      if (isPlaying) audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentTrack])

  const nextTrack = useCallback(() => {
    if (!queue.length) return
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
    if (shuffle && queue.length > 1) {
      let next = currentIndex
      while (next === currentIndex) next = Math.floor(Math.random() * queue.length)
      setCurrentTrack(queue[next])
      return
    }
    if (currentIndex < queue.length - 1) setCurrentTrack(queue[currentIndex + 1])
    else if (repeat) setCurrentTrack(queue[0])
  }, [queue, currentTrack.id, shuffle, repeat])

  const previousTrack = () => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 4) {
      audio.currentTime = 0
      return
    }
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
    if (currentIndex > 0) setCurrentTrack(queue[currentIndex - 1])
    else if (repeat && queue.length) setCurrentTrack(queue[queue.length - 1])
  }

  const playTrack = (track: Track, sourceQueue = tracks) => {
    setQueue(sourceQueue.length ? sourceQueue : [track])
    setCurrentTrack(track)
    setIsPlaying(true)
    requestAnimationFrame(() => audioRef.current?.play().catch(() => setIsPlaying(false)))
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !currentTrack.audio) return
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const openAlbum = async (album: AlbumItem) => {
    setSelectedAlbum(album)
    setDetailTracks([])
    go('album')
    if (plex && album.key) {
      try {
        const path = album.key.includes('/children') ? album.key : `${album.key}/children`
        const data = await fetchPlexJson(path)
        setDetailTracks(metadataArray(data).map((m: any) => mapTrack(m)))
      } catch {
        setDetailTracks(tracks.filter(t => t.album === album.title))
      }
    } else {
      setDetailTracks(tracks.filter(t => t.album === album.title))
    }
  }

  const openArtist = async (artist: ArtistItem) => {
    setSelectedArtist(artist)
    setDetailAlbums([])
    go('artist')
    if (plex && artist.key) {
      try {
        const path = artist.key.includes('/children') ? artist.key : `${artist.key}/children`
        const data = await fetchPlexJson(path)
        setDetailAlbums(metadataArray(data).map((m: any) => mapAlbum(m)))
      } catch {
        setDetailAlbums(albums.filter(a => a.artist === artist.title))
      }
    } else {
      setDetailAlbums(albums.filter(a => a.artist === artist.title))
    }
  }

  const connectManual = async (event: FormEvent) => {
    event.preventDefault()
    setPlexError('')
    if (!manualServerUrl.trim() || !manualToken.trim()) {
      setPlexError('Enter both the Plex server address and token.')
      return
    }
    setLoadingPlex(true)
    try {
      const url = manualServerUrl.trim().replace(/\/$/, '')
      const response = await fetch(`${url}/library/sections?X-Plex-Token=${encodeURIComponent(manualToken.trim())}`, {
        headers: { Accept: 'application/json', 'X-Plex-Client-Identifier': getClientId(), 'X-Plex-Product': APP_NAME },
      })
      if (!response.ok) throw new Error(`Plex returned ${response.status}.`)
      const data = await response.json()
      const sections = data?.MediaContainer?.Directory || []
      const music = sections.find((section: any) => section.type === 'artist')
      if (!music) throw new Error('I connected, but could not find a Music library.')
      const state: PlexState = {
        userToken: manualToken.trim(),
        serverToken: manualToken.trim(),
        serverUrl: url,
        serverName: data?.MediaContainer?.friendlyName || 'Plex Server',
        sectionKey: String(music.key),
        sectionTitle: music.title || 'Music',
      }
      localStorage.setItem(PLEX_STATE_KEY, JSON.stringify(state))
      setPlex(state)
      await loadPlexLibrary(state)
    } catch (error) {
      setPlexError(error instanceof Error ? error.message : 'Could not connect to Plex.')
      setLoadingPlex(false)
    }
  }

  const startPlexSignIn = async () => {
    setPlexError('')
    setLoadingPlex(true)
    try {
      const clientId = getClientId()
      const pinResponse = await fetch('https://plex.tv/api/v2/pins?strong=true', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Plex-Product': APP_NAME,
          'X-Plex-Client-Identifier': clientId,
        },
      })
      if (!pinResponse.ok) throw new Error('Plex sign in could not start.')
      const pin = await pinResponse.json()
      const authParams = new URLSearchParams({
        clientID: clientId,
        code: pin.code,
        forwardUrl: window.location.href,
      })
      authParams.set('context[device][product]', APP_NAME)
      const authUrl = `https://app.plex.tv/auth#?${authParams.toString()}`
      window.open(authUrl, 'plex-auth', 'width=620,height=760')

      const token = await new Promise<string>((resolve, reject) => {
        let attempts = 0
        const timer = window.setInterval(async () => {
          attempts += 1
          if (attempts > 180) {
            window.clearInterval(timer)
            reject(new Error('Plex sign in timed out. Try again.'))
            return
          }
          try {
            const poll = await fetch(`https://plex.tv/api/v2/pins/${pin.id}`, {
              headers: { Accept: 'application/json', 'X-Plex-Client-Identifier': clientId },
            })
            const data = await poll.json()
            if (data.authToken) {
              window.clearInterval(timer)
              resolve(data.authToken)
            }
          } catch {
            // keep polling during short network interruptions
          }
        }, 1000)
      })

      setPendingUserToken(token)
      const resourcesResponse = await fetch('https://clients.plex.tv/api/v2/resources?includeHttps=1&includeRelay=1&includeIPv6=1', {
        headers: {
          Accept: 'application/json',
          'X-Plex-Product': APP_NAME,
          'X-Plex-Client-Identifier': clientId,
          'X-Plex-Token': token,
        },
      })
      if (!resourcesResponse.ok) throw new Error('Signed in, but could not find your Plex servers.')
      const resources: PlexResource[] = await resourcesResponse.json()
      const servers = resources.filter(resource => resource.provides?.split(',').includes('server'))
      if (!servers.length) throw new Error('Signed in, but no Plex Media Server was found.')
      setServerChoices(servers)
      if (servers.length === 1) await chooseServer(servers[0], token)
    } catch (error) {
      setPlexError(error instanceof Error ? error.message : 'Plex sign in failed.')
    } finally {
      setLoadingPlex(false)
    }
  }

  const chooseServer = async (resource: PlexResource, userToken = pendingUserToken) => {
    setLoadingPlex(true)
    setPlexError('')
    try {
      const connections = [...(resource.connections || [])].sort((a, b) => Number(Boolean(b.local)) - Number(Boolean(a.local)) || Number(Boolean(a.relay)) - Number(Boolean(b.relay)))
      if (!connections.length) throw new Error('That Plex server has no available connection.')
      const token = resource.accessToken || userToken
      let chosen: PlexConnection | undefined
      let sectionsData: any
      for (const connection of connections) {
        try {
          const controller = new AbortController()
          const timer = window.setTimeout(() => controller.abort(), 4500)
          const response = await fetch(`${connection.uri.replace(/\/$/, '')}/library/sections?X-Plex-Token=${encodeURIComponent(token)}`, {
            signal: controller.signal,
            headers: { Accept: 'application/json', 'X-Plex-Client-Identifier': getClientId(), 'X-Plex-Product': APP_NAME },
          })
          window.clearTimeout(timer)
          if (response.ok) {
            chosen = connection
            sectionsData = await response.json()
            break
          }
        } catch {
          // try next connection
        }
      }
      if (!chosen) throw new Error('I found your server, but the browser could not connect to it. The manual connection option may work better for this prototype.')
      const sections = sectionsData?.MediaContainer?.Directory || []
      const music = sections.find((section: any) => section.type === 'artist')
      if (!music) throw new Error('That server does not appear to have a Music library.')
      const state: PlexState = {
        userToken,
        serverToken: token,
        serverUrl: chosen.uri.replace(/\/$/, ''),
        serverName: resource.name,
        sectionKey: String(music.key),
        sectionTitle: music.title || 'Music',
      }
      localStorage.setItem(PLEX_STATE_KEY, JSON.stringify(state))
      setPlex(state)
      setServerChoices([])
      await loadPlexLibrary(state)
    } catch (error) {
      setPlexError(error instanceof Error ? error.message : 'Could not connect to that server.')
    } finally {
      setLoadingPlex(false)
    }
  }

  const disconnectPlex = () => {
    localStorage.removeItem(PLEX_STATE_KEY)
    setPlex(null)
    setAlbums(demoAlbums)
    setTracks(demoTracks)
    setArtists(demoArtists)
    setPlaylists(demoPlaylists)
    setQueue(demoTracks)
    setCurrentTrack(demoTracks[0])
    setSettingsOpen(false)
  }

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { albums: [], artists: [], tracks: [], playlists: [] }
    return {
      albums: albums.filter(a => `${a.title} ${a.artist}`.toLowerCase().includes(q)).slice(0, 12),
      artists: artists.filter(a => a.title.toLowerCase().includes(q)).slice(0, 12),
      tracks: tracks.filter(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q)).slice(0, 30),
      playlists: playlists.filter(p => `${p.title} ${p.subtitle || ''}`.toLowerCase().includes(q)).slice(0, 12),
    }
  }, [query, albums, artists, tracks, playlists])

  const currentAlbum = albums.find(a => a.title === currentTrack.album && a.artist === currentTrack.artist)
  const currentArtItem = currentTrack.art ? { id: currentTrack.id, title: currentTrack.album, art: currentTrack.art } : currentAlbum || { id: currentTrack.id, title: currentTrack.album }

  return (
    <div className="app-shell">
      <audio
        ref={audioRef}
        src={currentTrack.audio}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={event => setDuration(event.currentTarget.duration || currentTrack.duration || 0)}
        onEnded={() => {
          if (repeat === 2 && audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
          } else nextTrack()
        }}
      />

      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><MusicNote weight="fill" /></div><span>Plex Music</span></div>
        <nav className="nav-list" aria-label="Main navigation">
          <NavButton active={view === 'home'} icon={<House />} label="Home" onClick={() => go('home')} />
          <NavButton active={view === 'search'} icon={<MagnifyingGlass />} label="Search" onClick={() => go('search')} />
          <div className="nav-heading">Library</div>
          <NavButton active={view === 'library'} icon={<List />} label="Recently Added" onClick={() => go('library')} />
          <NavButton active={view === 'albums'} icon={<Album />} label="Albums" onClick={() => go('albums')} />
          <NavButton active={view === 'artists'} icon={<Users />} label="Artists" onClick={() => go('artists')} />
          <NavButton active={view === 'songs'} icon={<MusicNote />} label="Songs" onClick={() => go('songs')} />
          <NavButton active={view === 'playlists'} icon={<Playlist />} label="Playlists" onClick={() => go('playlists')} />
        </nav>
        <button className="profile-card" onClick={() => setSettingsOpen(true)}>
          <div className="profile-icon"><UserCircle weight="duotone" /></div>
          <div><strong>{plex ? plex.serverName : 'Demo Library'}</strong><span>{plex ? plex.sectionTitle : 'Connect your Plex server'}</span></div>
          <GearSix />
        </button>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="history-controls">
            <button className="round-button" onClick={goBack} disabled={!history.length} aria-label="Back"><CaretLeft /></button>
            <button className="round-button" disabled aria-label="Forward"><CaretRight /></button>
          </div>
          <div className="topbar-title">{navLabel(view)}</div>
          <div className="topbar-actions">
            {plex && <span className="connection-pill"><span className="status-dot" />{plex.serverName}</span>}
            <button className="round-button" onClick={() => setSettingsOpen(true)} aria-label="Settings"><GearSix /></button>
          </div>
        </header>

        <div className="content-scroll">
          {view === 'home' && <HomeView albums={albums} tracks={tracks} artists={artists} playlists={playlists} onAlbum={openAlbum} onArtist={openArtist} onPlay={playTrack} />}
          {view === 'search' && <SearchView query={query} setQuery={setQuery} results={searchResults} onAlbum={openAlbum} onArtist={openArtist} onPlay={playTrack} />}
          {view === 'library' && <GridView title="Recently Added" subtitle={plex ? plex.sectionTitle : 'Demo music'} albums={[...albums].sort((a,b) => (b.addedAt || b.year || 0) - (a.addedAt || a.year || 0))} onAlbum={openAlbum} />}
          {view === 'albums' && <GridView title="Albums" subtitle={`${albums.length} albums`} albums={albums} onAlbum={openAlbum} />}
          {view === 'artists' && <ArtistsView artists={artists} onArtist={openArtist} />}
          {view === 'songs' && <SongsView tracks={tracks} onPlay={playTrack} />}
          {view === 'playlists' && <PlaylistsView playlists={playlists} />}
          {view === 'album' && selectedAlbum && <AlbumDetail album={selectedAlbum} tracks={detailTracks.length ? detailTracks : tracks.filter(t => t.album === selectedAlbum.title)} onPlay={playTrack} />}
          {view === 'artist' && selectedArtist && <ArtistDetail artist={selectedArtist} albums={detailAlbums.length ? detailAlbums : albums.filter(a => a.artist === selectedArtist.title)} onAlbum={openAlbum} />}
        </div>
      </main>

      <div className="player-bar">
        <button className="now-playing-summary" onClick={() => setQueueOpen(false)}>
          <Cover item={currentArtItem} className="player-cover" />
          <div className="ellipsis"><strong>{currentTrack.title}</strong><span>{currentTrack.artist}</span></div>
        </button>
        <div className="transport-wrap">
          <div className="transport-controls">
            <button className={`icon-button ${shuffle ? 'active' : ''}`} onClick={() => setShuffle(v => !v)} aria-label="Shuffle"><Shuffle /></button>
            <button className="icon-button" onClick={previousTrack} aria-label="Previous"><SkipBack weight="fill" /></button>
            <button className="play-button" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}</button>
            <button className="icon-button" onClick={nextTrack} aria-label="Next"><SkipForward weight="fill" /></button>
            <button className={`icon-button ${repeat ? 'active' : ''}`} onClick={() => setRepeat(r => (r === 0 ? 1 : r === 1 ? 2 : 0))} aria-label="Repeat">{repeat === 2 ? <RepeatOnce /> : <Repeat />}</button>
          </div>
          <div className="timeline">
            <span>{durationLabel(currentTime)}</span>
            <input
              aria-label="Playback position"
              type="range"
              min="0"
              max={Math.max(duration, 1)}
              step="0.1"
              value={Math.min(currentTime, Math.max(duration, 1))}
              onChange={event => {
                const value = Number(event.target.value)
                if (audioRef.current) audioRef.current.currentTime = value
                setCurrentTime(value)
              }}
            />
            <span>{durationLabel(duration)}</span>
          </div>
        </div>
        <div className="player-actions">
          <button className={`icon-button ${queueOpen ? 'active' : ''}`} onClick={() => setQueueOpen(v => !v)} aria-label="Queue"><Queue /></button>
          <button className="icon-button" onClick={() => setMuted(v => !v)} aria-label="Mute">{muted || volume === 0 ? <SpeakerSlash /> : volume < .5 ? <SpeakerLow /> : <SpeakerHigh />}</button>
          <input className="volume-slider" aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={event => setVolume(Number(event.target.value))} />
        </div>
      </div>

      {queueOpen && <QueuePanel queue={queue} currentTrack={currentTrack} onClose={() => setQueueOpen(false)} onPlay={track => playTrack(track, queue)} />}
      {settingsOpen && (
        <SettingsModal
          plex={plex}
          loading={loadingPlex}
          error={plexError}
          serverChoices={serverChoices}
          manualServerUrl={manualServerUrl}
          manualToken={manualToken}
          setManualServerUrl={setManualServerUrl}
          setManualToken={setManualToken}
          onClose={() => setSettingsOpen(false)}
          onPlexSignIn={startPlexSignIn}
          onChooseServer={server => chooseServer(server)}
          onManualConnect={connectManual}
          onDisconnect={disconnectPlex}
          onRefresh={() => plex && loadPlexLibrary(plex)}
        />
      )}
    </div>
  )
}

function NavButton({ active, icon, label, onClick }: { active?: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return <div className="section-title"><h2>{children}</h2>{action && <button>{action}</button>}</div>
}

function HomeView({ albums, tracks, artists, playlists, onAlbum, onArtist, onPlay }: {
  albums: AlbumItem[]; tracks: Track[]; artists: ArtistItem[]; playlists: PlaylistItem[];
  onAlbum: (album: AlbumItem) => void; onArtist: (artist: ArtistItem) => void; onPlay: (track: Track, queue?: Track[]) => void
}) {
  const recent = albums.slice(0, 6)
  const mostPlayed = [...albums].sort((a,b) => (b.plays || 0) - (a.plays || 0)).slice(0, 6)
  const topTracks = [...tracks].sort((a,b) => (b.plays || 0) - (a.plays || 0)).slice(0, 8)
  return (
    <div className="page home-page">
      <div className="page-heading"><div><p className="eyebrow">YOUR MUSIC</p><h1>Home</h1></div><p className="page-subtitle">A visual home for your Plex music library.</p></div>
      <SectionTitle>Recent Releases</SectionTitle>
      <div className="feature-rail">
        {recent.map((album, index) => (
          <button key={album.id} className="feature-card" onClick={() => onAlbum(album)}>
            <Cover item={album} />
            <div className="feature-shade" />
            <span className="badge">{index < 2 ? 'NEW ALBUM' : 'RECENT'}</span>
            <div className="feature-copy"><h3>{album.title}</h3><p>{album.artist}</p><span>{[album.genre, album.year].filter(Boolean).join(' · ')}</span></div>
          </button>
        ))}
      </div>

      <SectionTitle>Most Played</SectionTitle>
      <div className="large-rail">
        {mostPlayed.map(album => (
          <button key={album.id} className="large-card" onClick={() => onAlbum(album)}>
            <Cover item={album} />
            <div className="feature-shade" />
            <div className="feature-copy"><span className="overline">MOST PLAYED</span><h3>{album.title}</h3><p>{album.artist}</p><span>{album.plays || 0} plays</span></div>
          </button>
        ))}
      </div>

      <SectionTitle>Top Songs</SectionTitle>
      <div className="rank-grid">
        {topTracks.map((track, index) => (
          <button className="rank-row" key={track.id} onClick={() => onPlay(track, topTracks)}>
            <span className="rank-number">{index + 1}</span>
            <Cover item={{ id: track.id, title: track.album, art: track.art }} className="song-cover" />
            <span className="track-copy"><strong>{track.title}</strong><small>{track.artist} · {track.album}</small></span>
            <Play className="row-play" weight="fill" />
          </button>
        ))}
      </div>

      <SectionTitle>Top Artists</SectionTitle>
      <div className="artist-rail">
        {artists.slice(0, 10).map(artist => (
          <button key={artist.id} className="artist-card" onClick={() => onArtist(artist)}><Cover item={artist} rounded /><span>{artist.title}</span></button>
        ))}
      </div>

      <SectionTitle>Playlists</SectionTitle>
      <div className="playlist-rail">
        {playlists.slice(0, 8).map((playlist, index) => <PlaylistCard key={playlist.id} playlist={playlist} index={index} />)}
      </div>

      <SectionTitle>Album Wall</SectionTitle>
      <div className="album-wall">
        {albums.slice(0, 18).map(album => <button key={album.id} onClick={() => onAlbum(album)}><Cover item={album} /></button>)}
      </div>
    </div>
  )
}

function SearchView({ query, setQuery, results, onAlbum, onArtist, onPlay }: {
  query: string; setQuery: (value: string) => void;
  results: { albums: AlbumItem[]; artists: ArtistItem[]; tracks: Track[]; playlists: PlaylistItem[] };
  onAlbum: (album: AlbumItem) => void; onArtist: (artist: ArtistItem) => void; onPlay: (track: Track, q?: Track[]) => void
}) {
  const any = results.albums.length || results.artists.length || results.tracks.length || results.playlists.length
  return <div className="page search-page">
    <div className="search-hero"><h1>Search</h1><label className="search-box"><MagnifyingGlass /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Artists, albums, songs and playlists" /></label></div>
    {!query && <div className="empty-state"><MagnifyingGlass weight="duotone" /><h2>Search your library</h2><p>Everything loaded from Plex will be searchable here.</p></div>}
    {query && !any && <div className="empty-state"><h2>No results</h2><p>Try another artist, album or song name.</p></div>}
    {!!results.artists.length && <><SectionTitle>Artists</SectionTitle><div className="artist-rail">{results.artists.map(a => <button className="artist-card" key={a.id} onClick={() => onArtist(a)}><Cover item={a} rounded /><span>{a.title}</span></button>)}</div></>}
    {!!results.albums.length && <><SectionTitle>Albums</SectionTitle><div className="album-grid compact">{results.albums.map(a => <AlbumTile key={a.id} album={a} onClick={() => onAlbum(a)} />)}</div></>}
    {!!results.tracks.length && <><SectionTitle>Songs</SectionTitle><TrackTable tracks={results.tracks} onPlay={track => onPlay(track, results.tracks)} /></>}
  </div>
}

function GridView({ title, subtitle, albums, onAlbum }: { title: string; subtitle: string; albums: AlbumItem[]; onAlbum: (a: AlbumItem) => void }) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">LIBRARY</p><h1>{title}</h1></div><p className="page-subtitle">{subtitle}</p></div><div className="album-grid">{albums.map(a => <AlbumTile key={a.id} album={a} onClick={() => onAlbum(a)} />)}</div></div>
}

function AlbumTile({ album, onClick }: { album: AlbumItem; onClick: () => void }) {
  return <button className="album-tile" onClick={onClick}><Cover item={album} /><div><strong>{album.title}</strong><span>{album.artist}{album.year ? ` · ${album.year}` : ''}</span></div></button>
}

function ArtistsView({ artists, onArtist }: { artists: ArtistItem[]; onArtist: (artist: ArtistItem) => void }) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">LIBRARY</p><h1>Artists</h1></div><p className="page-subtitle">{artists.length} artists</p></div><div className="artist-grid">{artists.map(a => <button className="artist-grid-card" key={a.id} onClick={() => onArtist(a)}><Cover item={a} rounded /><strong>{a.title}</strong></button>)}</div></div>
}

function SongsView({ tracks, onPlay }: { tracks: Track[]; onPlay: (track: Track, q?: Track[]) => void }) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">LIBRARY</p><h1>Songs</h1></div><p className="page-subtitle">{tracks.length} songs loaded</p></div><TrackTable tracks={tracks} onPlay={track => onPlay(track, tracks)} /></div>
}

function TrackTable({ tracks, onPlay }: { tracks: Track[]; onPlay: (track: Track) => void }) {
  return <div className="track-table">{tracks.map((track, index) => <button className="track-row" key={track.id} onDoubleClick={() => onPlay(track)} onClick={() => onPlay(track)}><span className="track-index">{index + 1}</span><Cover item={{ id: track.id, title: track.album, art: track.art }} className="song-cover" /><span className="track-copy"><strong>{track.title}</strong><small>{track.artist}</small></span><span className="track-album">{track.album}</span><span className="track-duration">{durationLabel(track.duration)}</span><DotsThree /></button>)}</div>
}

function PlaylistsView({ playlists }: { playlists: PlaylistItem[] }) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">LIBRARY</p><h1>Playlists</h1></div><p className="page-subtitle">{playlists.length} playlists</p></div><div className="playlist-grid">{playlists.map((playlist, index) => <PlaylistCard key={playlist.id} playlist={playlist} index={index} />)}</div></div>
}

function PlaylistCard({ playlist, index }: { playlist: PlaylistItem; index: number }) {
  return <button className="playlist-card"><div className="playlist-art" style={{ background: playlist.art ? `url(${playlist.art}) center/cover` : coverGradient(`playlist-${index}`) }}><div className="playlist-overlay"><span className="playlist-accent" /><strong>{playlist.title}</strong></div></div><div className="playlist-copy"><strong>{playlist.title}</strong><span>{playlist.subtitle}</span></div></button>
}

function AlbumDetail({ album, tracks, onPlay }: { album: AlbumItem; tracks: Track[]; onPlay: (track: Track, q?: Track[]) => void }) {
  return <div className="page detail-page"><section className="detail-hero"><Cover item={album} className="detail-cover" /><div className="detail-copy"><p className="eyebrow">ALBUM</p><h1>{album.title}</h1><h2>{album.artist}</h2><p>{[album.genre, album.year].filter(Boolean).join(' · ')}</p><div className="detail-buttons"><button className="primary-button" disabled={!tracks.length} onClick={() => tracks[0] && onPlay(tracks[0], tracks)}><Play weight="fill" /> Play</button><button className="secondary-button" disabled={!tracks.length} onClick={() => tracks[0] && onPlay(tracks[Math.floor(Math.random()*tracks.length)], tracks)}><Shuffle /> Shuffle</button></div></div></section><TrackTable tracks={tracks} onPlay={track => onPlay(track, tracks)} /></div>
}

function ArtistDetail({ artist, albums, onAlbum }: { artist: ArtistItem; albums: AlbumItem[]; onAlbum: (a: AlbumItem) => void }) {
  return <div className="page detail-page"><section className="artist-hero"><Cover item={artist} rounded className="artist-detail-cover" /><div><p className="eyebrow">ARTIST</p><h1>{artist.title}</h1><p>{albums.length} albums loaded</p></div></section><SectionTitle>Albums</SectionTitle><div className="album-grid">{albums.map(a => <AlbumTile key={a.id} album={a} onClick={() => onAlbum(a)} />)}</div></div>
}

function QueuePanel({ queue, currentTrack, onClose, onPlay }: { queue: Track[]; currentTrack: Track; onClose: () => void; onPlay: (track: Track) => void }) {
  return <aside className="queue-panel"><div className="panel-header"><div><p className="eyebrow">PLAYER</p><h2>Up Next</h2></div><button className="round-button" onClick={onClose}><X /></button></div><div className="queue-list">{queue.map((track, i) => <button className={`queue-row ${track.id === currentTrack.id ? 'active' : ''}`} key={`${track.id}-${i}`} onClick={() => onPlay(track)}><Cover item={{ id: track.id, title: track.album, art: track.art }} className="song-cover" /><span className="track-copy"><strong>{track.title}</strong><small>{track.artist}</small></span>{track.id === currentTrack.id && <span className="playing-bars"><i/><i/><i/></span>}</button>)}</div></aside>
}

function SettingsModal({ plex, loading, error, serverChoices, manualServerUrl, manualToken, setManualServerUrl, setManualToken, onClose, onPlexSignIn, onChooseServer, onManualConnect, onDisconnect, onRefresh }: {
  plex: PlexState | null; loading: boolean; error: string; serverChoices: PlexResource[]; manualServerUrl: string; manualToken: string;
  setManualServerUrl: (s:string)=>void; setManualToken:(s:string)=>void; onClose:()=>void; onPlexSignIn:()=>void; onChooseServer:(server:PlexResource)=>void; onManualConnect:(event:FormEvent)=>void; onDisconnect:()=>void; onRefresh:()=>void
}) {
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><div className="settings-modal"><div className="panel-header"><div><p className="eyebrow">SETTINGS</p><h2>Plex Connection</h2></div><button className="round-button" onClick={onClose}><X /></button></div>
    {plex ? <div className="connected-card"><div className="connected-icon"><Check weight="bold" /></div><div><strong>Connected</strong><span>{plex.serverName} · {plex.sectionTitle}</span><small>{plex.serverUrl}</small></div><button className="secondary-button" onClick={onRefresh} disabled={loading}><ArrowClockwise className={loading ? 'spin' : ''} /> Refresh</button><button className="danger-button" onClick={onDisconnect}><SignOut /> Disconnect</button></div> : <>
      <div className="settings-copy"><h3>Connect your Plex library</h3><p>For this prototype, you can try normal Plex sign in. If your browser blocks the local server connection, use the manual option below.</p></div>
      <button className="plex-button" disabled={loading} onClick={onPlexSignIn}><span className="plex-chevron">›</span>{loading ? 'Waiting for Plex…' : 'Sign in with Plex'}</button>
      {!!serverChoices.length && <div className="server-picker"><h3>Choose your server</h3>{serverChoices.map(server => <button key={server.name} onClick={() => onChooseServer(server)}><strong>{server.name}</strong><span>{server.owned ? 'Owned by you' : 'Shared with you'}</span><CaretRight /></button>)}</div>}
      <div className="divider"><span>or connect manually</span></div>
      <form className="manual-form" onSubmit={onManualConnect}>
        <label><span>Plex server address</span><input placeholder="http://192.168.1.20:32400" value={manualServerUrl} onChange={e=>setManualServerUrl(e.target.value)} /></label>
        <label><span>Plex token</span><input type="password" placeholder="Your X-Plex-Token" value={manualToken} onChange={e=>setManualToken(e.target.value)} /></label>
        <button className="secondary-button wide" disabled={loading} type="submit">{loading ? 'Connecting…' : 'Connect'}</button>
      </form>
      <div className="privacy-note"><strong>Prototype note</strong><span>The manual token is stored only in this browser's local storage. Do not paste your Plex token into chat or share it with anyone.</span></div>
    </>}
    {error && <div className="error-box">{error}</div>}
  </div></div>
}

export default App
