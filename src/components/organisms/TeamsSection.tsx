import { useEffect, useState } from "react"
import axios from "axios"

interface TeamMember {
  name: { first: string; last: string }
  picture: { large: string }
  login: { uuid: string }
}

const DUMMY_TEAM: TeamMember[] = [
  { login: { uuid: "1" }, name: { first: "Jean", last: "Baptiste" }, picture: { large: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" } },
  { login: { uuid: "2" }, name: { first: "Coco", last: "Noir" }, picture: { large: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" } },
  { login: { uuid: "3" }, name: { first: "Tom", last: "Ford" }, picture: { large: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" } },
]

export default function TeamsSection() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [visibleImages, setVisibleImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("https://randomuser.me/api/?results=10&seed=hmns")
        setTeam(res.data.results)
      } catch (error) {
        console.warn("API Teams gagal, menggunakan data fallback.", error)
        setTeam(DUMMY_TEAM)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleImages((prev) => {
          const newState = { ...prev }
          let changed = false
          entries.forEach((entry) => {
            const id = entry.target.id
            if (newState[id] !== entry.isIntersecting) {
              newState[id] = entry.isIntersecting
              changed = true
            }
          })
          return changed ? newState : prev
        })
      },
      { threshold: 0.5 }
    )
    const elements = document.querySelectorAll(".team-scroll-color-target")
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isMobile, team])

  return (
    <section id="teams" className="w-full py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The Faces Behind HMNS</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Bertemu dengan para peracik ahli dan pemikir kreatif di balik layar parfum kesayangan Anda.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {team.map((member) => (
              <div key={member.login.uuid} className="group flex flex-col items-center text-center space-y-4">
                <div className="relative w-32 h-32 overflow-hidden rounded-full border-2 border-border transition-transform group-hover:scale-105 group-hover:border-white">
                  <img
                    id={`team-img-${member.login.uuid}`}
                    src={member.picture.large}
                    alt={`${member.name.first} ${member.name.last}`}
                    className={`object-cover w-full h-full md:grayscale md:hover:grayscale-0 transition-all duration-300 team-scroll-color-target ${
                      isMobile && !visibleImages[`team-img-${member.login.uuid}`] ? "grayscale" : ""
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{member.name.first} {member.name.last}</h3>
                  <p className="text-sm text-muted-foreground">Artisan Perfumer</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
