export async function POST(request: Request) {
  const { recipeId } = await request.json();
  console.log(recipeId);
  // make synnc call to the image generation service hosted on aws
  const response = fetch("https://awsurl.com/generate", {
    method: "POST",
    body: JSON.stringify({ recipeId }),
  });
  //returun in standard app roouter format
  return Response.json({ message: "Image generation started" }, { status: 200 });
}