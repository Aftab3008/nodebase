interface Props {
  params: Promise<{ credentialId: string }>;
}

export default async function page({ params }: Props) {
  const { credentialId } = await params;
  return <div>{credentialId}</div>;
}
