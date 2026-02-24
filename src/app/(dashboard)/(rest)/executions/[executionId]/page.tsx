interface Props {
  params: Promise<{ executionId: string }>;
}

export default async function page({ params }: Props) {
  const { executionId } = await params;
  return <div>{executionId}</div>;
}
