import { Loader2 } from "lucide-react"
import { memo } from "react"

const Loading = memo(() => {
  return (
    <div className="h-screen w-screen text-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    </div>
  )
})

export default Loading
