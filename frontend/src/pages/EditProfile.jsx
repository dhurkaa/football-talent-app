import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiMail, HiUser } from "react-icons/hi";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "player",
    location: user?.location || "Pristina, Kosovo",
    bio:
      user?.bio ||
      "Ambitious football professional focused on clear development, strong performance habits, and the right opportunities."
  });

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUser(formData);
    toast.success("Profile updated.");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Edit <span className="gradient-text">Profile</span>
          </h1>
          <p className="mt-2 text-dark-400">Keep your account information and public profile polished.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Account</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={HiUser} />
              <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} icon={HiMail} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Profile Details</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="field-label">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                  <option value="player">Player</option>
                  <option value="scout">Scout</option>
                </select>
              </div>
              <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="mt-5">
              <label className="field-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
