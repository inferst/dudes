import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>{`Hello, ${user?.name}.`}</h1>
      {`Your personal OBS url: `}
      <a href="#">{user?.personalUrl}</a>
    </div>
  );
}
