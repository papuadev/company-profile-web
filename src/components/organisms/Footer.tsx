import { COMPANY_INFO } from "../../data/constants"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-10 gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-xl font-bold tracking-widest">{COMPANY_INFO.name}</p>
          <p className="text-sm text-muted-foreground text-center md:text-left max-w-[300px]">
            {COMPANY_INFO.description}
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted-foreground">
          <p>{COMPANY_INFO.address}</p>
          <p>{COMPANY_INFO.email}</p>
          <p>{COMPANY_INFO.phone}</p>
        </div>
      </div>
      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
