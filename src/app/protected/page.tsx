import { auth } from "@/auth"
import WhoAmIServerAction from "./WhoAmIServerAction"
import WhoAmIAPI from "./WhoAmIAPI"
import WhoAmIRSC from "./WhoAmIRSC"

export default async function TestRoute() {
  const session = await auth()

  return (
    <main>
      <h1 className="text-3xl mb-5">Test Route</h1>
      <div>User: {session?.user?.name}</div>
      <WhoAmIServerAction />
      <WhoAmIAPI />
      <WhoAmIRSC />
    </main>
  )
}
