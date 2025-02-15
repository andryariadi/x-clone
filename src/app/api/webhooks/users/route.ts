// import { prisma } from "@/libs/prisma.config";

export async function GET() {
  try {
    // const users = await prisma.user.findMany();
    // return new Response(JSON.stringify(users), { status: 200 });
    console.log("masuk ommmm mennn");

    return Response.json({ message: "API is working ni bosss mennn!" });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Database Error", { status: 500 });
  }
}
