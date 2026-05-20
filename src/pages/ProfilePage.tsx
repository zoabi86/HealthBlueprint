import { ProfileForm } from '../components/forms/ProfileForm';

export const ProfilePage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">User Profile</h1>
        <p className="text-gray-400 mt-2">Manage your personal health information</p>
      </div>

      <ProfileForm />
    </div>
  );
};
