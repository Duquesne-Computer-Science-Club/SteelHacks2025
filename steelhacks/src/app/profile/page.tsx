import { NextResponse } from "next/server";
// import { useUser } from "@auth0/nextjs-auth0"; // Remove this line, hooks can't be used in server actions
import { connectDB } from "@/lib/mongodb";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    // You need to get the user from the request/session in a server-compatible way.
    // For example, if using Auth0, you might use getSession from @auth0/nextjs-auth0 (server-side):
    // import { getSession } from "@auth0/nextjs-auth0";
    // const session = await getSession(req);
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }
    // For now, this is a placeholder:
    const session = null; // Replace with actual session retrieval logic
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    // Upsert user profile
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        username: session.user.email,
        email: session.user.email,
        profile: body.profile,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
