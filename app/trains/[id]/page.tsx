// app/trains/[id]/page.tsx
export const runtime = 'edge';



export default async function TrainDetailsPage({ params }: any) {
  const { id } = await params;

  return (
    <div>
      <h1>Train Details</h1>
    </div>
  );
}
