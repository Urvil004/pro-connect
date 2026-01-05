"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/Card";
import { PostFeed } from "@/components/PostFeed";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { ProfileLoadingScreen } from "@/components/LoadingScreen";
import {
  Edit3,
  Save,
  X,
  MapPin,
  Building,
  Calendar,
  Camera,
  Upload,
  UserPlus,
  UserCheck,
  Clock,
  MessageCircle,
  Loader2,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Link as LinkIcon,
  Globe,
  Star,
  Users,
  BookOpen,
  Languages,
  Heart,
  FileText,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Connection state
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  // Modal states
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  // Edit items
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [editingAward, setEditingAward] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    headline: "",
    bio: "",
    profilePicture: "",
    bannerImage: "",
    location: "",
    website: "",
  });

  // New item forms
  const [newSkill, setNewSkill] = useState("");
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    employmentType: "",
  });

  const [educationForm, setEducationForm] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    grade: "",
    description: "",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    technologies: [],
  });

  const [certificationForm, setCertificationForm] = useState({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    doesNotExpire: false,
  });

  const [languageForm, setLanguageForm] = useState({
    name: "",
    proficiency: "",
  });

  const [volunteerForm, setVolunteerForm] = useState({
    role: "",
    organization: "",
    cause: "",
    startDate: "",
    endDate: "",
    currentlyVolunteering: false,
    description: "",
  });

  const [awardForm, setAwardForm] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    description: "",
  });

  const isOwnProfile = user && user.uid === params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("🔍 Fetching profile for:", params.id);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`
        );

        console.log("Response status:", response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ Profile loaded:", userData);

          setProfile(userData);
          setEditData({
            name: userData.name || "",
            headline: userData.headline || "",
            bio: userData.bio || "",
            profilePicture: userData.profilePicture || "",
            bannerImage: userData.bannerImage || "",
            location: userData.location || "",
            website: userData.website || "",
          });
        } else {
          console.error("❌ Failed to fetch profile");
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  // Fetch connection status
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      if (!user || !params.id || isOwnProfile) return;

      setLoadingConnection(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/connections/status/${user.uid}/${params.id}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("🔗 Connection status:", data);
          setConnectionStatus(data);
        }
      } catch (error) {
        console.error("❌ Error fetching connection status:", error);
      } finally {
        setLoadingConnection(false);
      }
    };

    fetchConnectionStatus();
  }, [user, params.id, isOwnProfile]);

  // Handle connection request
  const handleConnect = async () => {
    if (!user || !profile) return;

    setSendingRequest(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/connections/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: user.uid,
            senderName: user.displayName || user.email,
            receiverId: profile.firebaseUid,
            receiverName: profile.name,
            message: `Hi ${profile.name}, I'd like to connect with you!`,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Connection request sent:", data);

        setConnectionStatus({
          status: "pending",
          isPending: true,
          isConnected: false,
          isSender: true,
          connection: data.connection,
        });

        alert("Connection request sent successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("❌ Error sending connection request:", error);
      alert("Failed to send connection request");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMessage = () => {
    if (!user || !profile) {
      alert("Please wait for profile to load");
      return;
    }

    console.log("💬 Opening messages with:", profile.name);
    router.push(
      `/messages?userId=${profile.firebaseUid || params.id}&userName=${encodeURIComponent(profile.name)}`
    );
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      name: profile.name || "",
      headline: profile.headline || "",
      bio: profile.bio || "",
      profilePicture: profile.profilePicture || "",
      bannerImage: profile.bannerImage || "",
      location: profile.location || "",
      website: profile.website || "",
    });
  };

  const handleSave = async () => {
    try {
      console.log("💾 Saving profile updates...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editData.name,
            headline: editData.headline,
            bio: editData.bio,
            profilePicture: editData.profilePicture,
            bannerImage: editData.bannerImage,
            location: editData.location,
            website: editData.website,
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("✅ Profile updated:", updatedUser);
        setProfile(updatedUser);
        setEditing(false);
      } else {
        console.error("❌ Failed to update profile");
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setUploadingImage(true);

    try {
      console.log("📤 Uploading profile picture...");

      const formDataObj = new FormData();
      formDataObj.append("profilePicture", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/profile-picture`,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("✅ Image uploaded:", data.url);

      setEditData((prev) => ({
        ...prev,
        profilePicture: data.url,
      }));
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // ✅ NEW: Handle banner image upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setUploadingBanner(true);

    try {
      console.log("📤 Uploading banner image...");

      const formDataObj = new FormData();
      formDataObj.append("bannerImage", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/banner-image`,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload banner");
      }

      const data = await response.json();
      console.log("✅ Banner uploaded:", data.url);

      setEditData((prev) => ({
        ...prev,
        bannerImage: data.url,
      }));
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to upload banner. Please try again.");
    } finally {
      setUploadingBanner(false);
    }
  };

  // ✅ NEW: Add Experience
  const handleAddExperience = async () => {
    if (!experienceForm.title || !experienceForm.company || !experienceForm.startDate) {
      alert("Please fill in all required fields (Title, Company, Start Date)");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/experience`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(experienceForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowExperienceModal(false);
        setExperienceForm({
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
          employmentType: "",
        });
        alert("Experience added successfully!");
      } else {
        alert("Failed to add experience");
      }
    } catch (error) {
      console.error("❌ Error adding experience:", error);
      alert("Error adding experience");
    }
  };

  // ✅ NEW: Update Experience
  const handleUpdateExperience = async () => {
    if (!editingExperience) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/experience/${editingExperience._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(experienceForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowExperienceModal(false);
        setEditingExperience(null);
        setExperienceForm({
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
          employmentType: "",
        });
        alert("Experience updated successfully!");
      } else {
        alert("Failed to update experience");
      }
    } catch (error) {
      console.error("❌ Error updating experience:", error);
      alert("Error updating experience");
    }
  };

  // ✅ NEW: Delete Experience
  const handleDeleteExperience = async (expId) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/experience/${expId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        alert("Experience deleted successfully!");
      } else {
        alert("Failed to delete experience");
      }
    } catch (error) {
      console.error("❌ Error deleting experience:", error);
      alert("Error deleting experience");
    }
  };

  // ✅ NEW: Add Education
  const handleAddEducation = async () => {
    if (!educationForm.school || !educationForm.degree || !educationForm.startDate) {
      alert("Please fill in all required fields (School, Degree, Start Date)");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/education`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(educationForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowEducationModal(false);
        setEducationForm({
          school: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          currentlyStudying: false,
          grade: "",
          description: "",
        });
        alert("Education added successfully!");
      } else {
        alert("Failed to add education");
      }
    } catch (error) {
      console.error("❌ Error adding education:", error);
      alert("Error adding education");
    }
  };

  // ✅ NEW: Update Education
  const handleUpdateEducation = async () => {
    if (!editingEducation) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/education/${editingEducation._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(educationForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowEducationModal(false);
        setEditingEducation(null);
        setEducationForm({
          school: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          currentlyStudying: false,
          grade: "",
          description: "",
        });
        alert("Education updated successfully!");
      } else {
        alert("Failed to update education");
      }
    } catch (error) {
      console.error("❌ Error updating education:", error);
      alert("Error updating education");
    }
  };

  // ✅ NEW: Delete Education
  const handleDeleteEducation = async (eduId) => {
    if (!confirm("Are you sure you want to delete this education?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/education/${eduId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        alert("Education deleted successfully!");
      } else {
        alert("Failed to delete education");
      }
    } catch (error) {
      console.error("❌ Error deleting education:", error);
      alert("Error deleting education");
    }
  };

  // ✅ NEW: Add Project
  const handleAddProject = async () => {
    if (!projectForm.title) {
      alert("Please enter a project title");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/projects`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowProjectModal(false);
        setProjectForm({
          title: "",
          description: "",
          link: "",
          image: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          technologies: [],
        });
        alert("Project added successfully!");
      } else {
        alert("Failed to add project");
      }
    } catch (error) {
      console.error("❌ Error adding project:", error);
      alert("Error adding project");
    }
  };

  // ✅ NEW: Update Project
  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/projects/${editingProject._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowProjectModal(false);
        setEditingProject(null);
        setProjectForm({
          title: "",
          description: "",
          link: "",
          image: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          technologies: [],
        });
        alert("Project updated successfully!");
      } else {
        alert("Failed to update project");
      }
    } catch (error) {
      console.error("❌ Error updating project:", error);
      alert("Error updating project");
    }
  };

  // ✅ NEW: Delete Project
  const handleDeleteProject = async (projId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/projects/${projId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        alert("Project deleted successfully!");
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  // ✅ NEW: Add Skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      alert("Please enter a skill");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/skills`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skill: newSkill.trim() }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setNewSkill("");
        alert("Skill added successfully!");
      } else {
        alert("Failed to add skill");
      }
    } catch (error) {
      console.error("❌ Error adding skill:", error);
      alert("Error adding skill");
    }
  };

  // ✅ NEW: Delete Skill
  const handleDeleteSkill = async (skill) => {
    if (!confirm(`Remove "${skill}" from your skills?`)) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/skills/${encodeURIComponent(skill)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        alert("Skill removed successfully!");
      } else {
        alert("Failed to remove skill");
      }
    } catch (error) {
      console.error("❌ Error removing skill:", error);
      alert("Error removing skill");
    }
  };

  // ✅ NEW: Add Certification
  const handleAddCertification = async () => {
    if (!certificationForm.name || !certificationForm.issuingOrganization || !certificationForm.issueDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/certifications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certificationForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        setShowCertificationModal(false);
        setCertificationForm({
          name: "",
          issuingOrganization: "",
          issueDate: "",
          expirationDate: "",
          credentialId: "",
          credentialUrl: "",
          doesNotExpire: false,
        });
        alert("Certification added successfully!");
      } else {
        alert("Failed to add certification");
      }
    } catch (error) {
      console.error("❌ Error adding certification:", error);
      alert("Error adding certification");
    }
  };

  // ✅ NEW: Delete Certification
  const handleDeleteCertification = async (certId) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}/certifications/${certId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        alert("Certification deleted successfully!");
      } else {
        alert("Failed to delete certification");
      }
    } catch (error) {
      console.error("❌ Error deleting certification:", error);
      alert("Error deleting certification");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDateRange = (startDate, endDate, current, currentLabel = "Present") => {
    if (!startDate) return "";
    
    const start = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    
    if (current) return `${start} - ${currentLabel}`;
    
    if (!endDate) return start;
    
    const end = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    
    return `${start} - ${end}`;
  };

  // Render connection button
  const renderConnectionButton = () => {
    if (loadingConnection) {
      return (
        <Button disabled className="bg-gray-300 dark:bg-gray-600">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading...
        </Button>
      );
    }

    if (!connectionStatus || connectionStatus.status === "none") {
      return (
        <Button
          onClick={handleConnect}
          disabled={sendingRequest}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        >
          {sendingRequest ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Connect
            </>
          )}
        </Button>
      );
    }

    if (connectionStatus.isPending) {
      if (connectionStatus.isSender) {
        return (
          <Button
            disabled
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </Button>
        );
      } else {
        return (
          <Button
            onClick={() => {
              router.push("/network");
            }}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Accept Request
          </Button>
        );
      }
    }

    if (connectionStatus.isConnected) {
      return (
        <Button
          disabled
          className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-600 cursor-default"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Connected
        </Button>
      );
    }

    return null;
  };

  if (loading) {
    return <ProfileLoadingScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Main Profile Card */}
        <Card className="mb-6 overflow-hidden">
          {/* ✅ NEW: Banner/Cover Photo with Upload */}
          {/* ✅ FIXED: Banner/Cover Photo with Upload */}
<div className="h-48 relative">
  {editData.bannerImage || profile.bannerImage ? (
    <Image
      src={editing ? editData.bannerImage : profile.bannerImage}
      alt="Banner"
      fill
      className="object-cover"
    />
  ) : (
    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
      <div className="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-30"></div>
    </div>
  )}

  {/* ✅ FIXED: Banner Upload Button (Only in Edit Mode) */}
  {editing && isOwnProfile && (
    <div className="absolute bottom-4 right-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleBannerUpload}
        className="hidden"
        id="bannerUpload"
        disabled={uploadingBanner}
      />
      <label
        htmlFor="bannerUpload"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 h-10 px-4 py-2 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600"
      >
        {uploadingBanner ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span className="text-gray-900 dark:text-gray-100">Uploading...</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-100" />
            <span className="text-gray-900 dark:text-gray-100">Edit Banner</span>
          </>
        )}
      </label>
    </div>
  )}
</div>

          {/* Profile Information */}
          <div className="px-6 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
              {/* Profile Picture */}
              <div className="relative -mt-16 mb-4 lg:mb-0">
                {editing ? (
                  <div className="relative">
                    {editData.profilePicture ? (
                      <Image
                        src={editData.profilePicture}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {getInitials(editData.name)}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profilePictureEdit"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="profilePictureEdit"
                      className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      {uploadingImage ? (
                        <div className="h-4 w-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    {profile.profilePicture ? (
                      <Image
                        src={profile.profilePicture}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {getInitials(profile.name)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 pt-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    {editing ? (
                      <div className="space-y-4">
                        <div>
                          <Input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Full Name"
                            className="text-2xl font-bold border-0 border-b-2 border-gray-200 dark:border-gray-600 rounded-none px-0 focus:border-blue-600 dark:focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Input
                            value={editData.headline}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                headline: e.target.value,
                              }))
                            }
                            placeholder="Professional Headline (e.g., Software Engineer | Full Stack Developer)"
                            maxLength={220}
                            className="text-lg border-0 border-b-2 border-gray-200 dark:border-gray-600 rounded-none px-0 focus:border-blue-600 dark:focus:border-blue-400"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {editData.headline.length}/220 characters
                          </p>
                        </div>
                        <div>
                          <Input
                            value={editData.location}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            placeholder="Location (e.g., San Francisco, CA)"
                            className="border-0 border-b-2 border-gray-200 dark:border-gray-600 rounded-none px-0 focus:border-blue-600 dark:focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Input
                            value={editData.website}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                website: e.target.value,
                              }))
                            }
                            placeholder="Website URL (e.g., https://yourwebsite.com)"
                            type="url"
                            className="border-0 border-b-2 border-gray-200 dark:border-gray-600 rounded-none px-0 focus:border-blue-600 dark:focus:border-blue-400"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {profile.name}
                        </h1>
                        {profile.headline && (
                          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                            {profile.headline}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {profile.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{profile.location}</span>
                            </div>
                          )}
                          {profile.website && (
                            <a
                              href={profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              <span>Website</span>
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                        {profile.connectionCount > 0 && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {profile.connectionCount}
                            </span>
                            <span className="ml-1">connections</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
                    {isOwnProfile ? (
                      editing ? (
                        <>
                          <Button
                            onClick={handleSave}
                            disabled={uploadingImage || uploadingBanner}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {uploadingImage || uploadingBanner ? "Uploading..." : "Save"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={handleEdit}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </>
                      )
                    ) : (
                      <>
                        {renderConnectionButton()}
                        <Button
                          onClick={handleMessage}
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-50"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                About
              </h2>
            </div>
            {editing ? (
              <div>
                <Textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Write about yourself, your career journey, interests, or anything you'd like others to know..."
                  rows={6}
                  maxLength={2600}
                  className="w-full border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {editData.bio.length}/2600 characters
                </p>
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio ? (
                  <p className="whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    {isOwnProfile
                      ? "Add information about yourself to help others get to know you better."
                      : "No information available."}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* ✅ NEW: Experience Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Experience
              </h2>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingExperience(null);
                    setExperienceForm({
                      title: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      currentlyWorking: false,
                      description: "",
                      employmentType: "",
                    });
                    setShowExperienceModal(true);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </Button>
              )}
            </div>

            {profile.experience && profile.experience.length > 0 ? (
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div
                    key={exp._id || `exp-${index}`}
                    className="border-l-2 border-blue-500 dark:border-blue-400 pl-4 relative"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 border-2 border-white dark:border-gray-800"></div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {exp.company}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {exp.employmentType && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              {exp.employmentType}
                            </span>
                          )}
                          {exp.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </div>

                      {isOwnProfile && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingExperience(exp);
                              setExperienceForm({
                                title: exp.title,
                                company: exp.company,
                                location: exp.location || "",
                                startDate: exp.startDate,
                                endDate: exp.endDate || "",
                                currentlyWorking: exp.currentlyWorking,
                                description: exp.description || "",
                                employmentType: exp.employmentType || "",
                              });
                              setShowExperienceModal(true);
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDeleteExperience(exp._id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                {isOwnProfile
                  ? "Add your work experience to showcase your career journey"
                  : "No experience added yet"}
              </p>
            )}
          </div>
        </Card>

        {/* ✅ NEW: Education Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education
              </h2>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingEducation(null);
                    setEducationForm({
                      school: "",
                      degree: "",
                      fieldOfStudy: "",
                      startDate: "",
                      endDate: "",
                      currentlyStudying: false,
                      grade: "",
                      description: "",
                    });
                    setShowEducationModal(true);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              )}
            </div>

            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div
                    key={edu._id || `edu-${index}`}
                    className="border-l-2 border-green-500 dark:border-green-400 pl-4 relative"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800"></div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {edu.school}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {edu.degree}
                          {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDateRange(edu.startDate, edu.endDate, edu.currentlyStudying)}
                        </p>
                        {edu.grade && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Grade: {edu.grade}
                          </p>
                        )}
                        {edu.description && (
                          <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                            {edu.description}
                          </p>
                        )}
                      </div>

                      {isOwnProfile && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingEducation(edu);
                              setEducationForm({
                                school: edu.school,
                                degree: edu.degree,
                                fieldOfStudy: edu.fieldOfStudy || "",
                                startDate: edu.startDate,
                                endDate: edu.endDate || "",
                                currentlyStudying: edu.currentlyStudying,
                                grade: edu.grade || "",
                                description: edu.description || "",
                              });
                              setShowEducationModal(true);
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDeleteEducation(edu._id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                {isOwnProfile
                  ? "Add your education to showcase your academic background"
                  : "No education added yet"}
              </p>
            )}
          </div>
        </Card>

        {/* ✅ NEW: Skills Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Skills
              </h2>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSkillsModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              )}
            </div>

            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {skill}
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                {isOwnProfile
                  ? "Add skills to showcase your expertise"
                  : "No skills added yet"}
              </p>
            )}
          </div>
        </Card>

        {/* ✅ NEW: Projects Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Projects
              </h2>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: "",
                      description: "",
                      link: "",
                      image: "",
                      startDate: "",
                      endDate: "",
                      currentlyWorking: false,
                      technologies: [],
                    });
                    setShowProjectModal(true);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </Button>
              )}
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((project, index) => (
                  <div
                    key={project._id || `project-${index}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {project.image && (
                      <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.map((tech, idx) => (
                              <span
                                key={`tech-${idx}`}
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            View Project
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                        {(project.startDate || project.endDate) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {formatDateRange(project.startDate, project.endDate, project.currentlyWorking, "Ongoing")}
                          </p>
                        )}
                      </div>

                      {isOwnProfile && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingProject(project);
                              setProjectForm({
                                title: project.title,
                                description: project.description || "",
                                link: project.link || "",
                                image: project.image || "",
                                startDate: project.startDate || "",
                                endDate: project.endDate || "",
                                currentlyWorking: project.currentlyWorking,
                                technologies: project.technologies || [],
                              });
                              setShowProjectModal(true);
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDeleteProject(project._id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                {isOwnProfile
                  ? "Add projects to showcase your work"
                  : "No projects added yet"}
              </p>
            )}
          </div>
        </Card>

        {/* ✅ NEW: Certifications Section */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications
              </h2>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingCertification(null);
                    setCertificationForm({
                      name: "",
                      issuingOrganization: "",
                      issueDate: "",
                      expirationDate: "",
                      credentialId: "",
                      credentialUrl: "",
                      doesNotExpire: false,
                    });
                    setShowCertificationModal(true);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </Button>
              )}
            </div>

            {profile.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div
                    key={cert._id || `cert-${index}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {cert.name}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {cert.issuingOrganization}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Issued {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            {cert.doesNotExpire 
                              ? " • No Expiration" 
                              : cert.expirationDate 
                              ? ` • Expires ${new Date(cert.expirationDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                              : ""}
                          </p>
                          {cert.credentialId && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Credential ID: {cert.credentialId}
                            </p>
                          )}
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                            >
                              Show credential
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>

                      {isOwnProfile && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDeleteCertification(cert._id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                {isOwnProfile
                  ? "Add certifications to showcase your credentials"
                  : "No certifications added yet"}
              </p>
            )}
          </div>
        </Card>

        {/* Activity/Posts Section */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Activity
            </h2>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <PostFeed userId={params.id} />
            </div>
          </div>
        </Card>
      </div>

      {/* ✅ MODALS - Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingExperience ? "Edit Experience" : "Add Experience"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowExperienceModal(false);
                    setEditingExperience(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={experienceForm.title}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, title: e.target.value })
                    }
                    placeholder="Ex: Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={experienceForm.company}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, company: e.target.value })
                    }
                    placeholder="Ex: Google"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={experienceForm.employmentType}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, employmentType: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Location
                  </label>
                  <Input
                    value={experienceForm.location}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, location: e.target.value })
                    }
                    placeholder="Ex: San Francisco, CA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="month"
                      value={experienceForm.startDate}
                      onChange={(e) =>
                        setExperienceForm({ ...experienceForm, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={experienceForm.endDate}
                      onChange={(e) =>
                        setExperienceForm({ ...experienceForm, endDate: e.target.value })
                      }
                      disabled={experienceForm.currentlyWorking}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="currentlyWorking"
                    checked={experienceForm.currentlyWorking}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="currentlyWorking"
                    className="ml-2 text-sm text-gray-900 dark:text-gray-200"
                  >
                    I am currently working in this role
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, description: e.target.value })
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={editingExperience ? handleUpdateExperience : handleAddExperience}
                  className="flex-1"
                >
                  {editingExperience ? "Update" : "Add"} Experience
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowExperienceModal(false);
                    setEditingExperience(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingEducation ? "Edit Education" : "Add Education"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEducationModal(false);
                    setEditingEducation(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    School <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={educationForm.school}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, school: e.target.value })
                    }
                    placeholder="Ex: Stanford University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={educationForm.degree}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, degree: e.target.value })
                    }
                    placeholder="Ex: Bachelor's Degree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Field of Study
                  </label>
                  <Input
                    value={educationForm.fieldOfStudy}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })
                    }
                    placeholder="Ex: Computer Science"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="month"
                      value={educationForm.startDate}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={educationForm.endDate}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, endDate: e.target.value })
                      }
                      disabled={educationForm.currentlyStudying}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="currentlyStudying"
                    checked={educationForm.currentlyStudying}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, currentlyStudying: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="currentlyStudying"
                    className="ml-2 text-sm text-gray-900 dark:text-gray-200"
                  >
                    I am currently studying here
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Grade
                  </label>
                  <Input
                    value={educationForm.grade}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, grade: e.target.value })
                    }
                    placeholder="Ex: 3.8 GPA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={educationForm.description}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, description: e.target.value })
                    }
                    placeholder="Describe activities, achievements, coursework..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={editingEducation ? handleUpdateEducation : handleAddEducation}
                  className="flex-1"
                >
                  {editingEducation ? "Update" : "Add"} Education
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEducationModal(false);
                    setEditingEducation(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    placeholder="Ex: E-commerce Platform"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                    placeholder="Describe your project..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Project Link
                  </label>
                  <Input
                    value={projectForm.link}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, link: e.target.value })
                    }
                    placeholder="https://github.com/yourproject"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Project Image URL
                  </label>
                  <Input
                    value={projectForm.image}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, image: e.target.value })
                    }
                    placeholder="https://example.com/project-image.jpg"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <Input
                    value={projectForm.technologies.join(", ")}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Ex: React, Node.js, MongoDB"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={projectForm.startDate}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={projectForm.endDate}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, endDate: e.target.value })
                      }
                      disabled={projectForm.currentlyWorking}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="currentlyWorkingProject"
                    checked={projectForm.currentlyWorking}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, currentlyWorking: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="currentlyWorkingProject"
                    className="ml-2 text-sm text-gray-900 dark:text-gray-200"
                  >
                    I am currently working on this project
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={editingProject ? handleUpdateProject : handleAddProject}
                  className="flex-1"
                >
                  {editingProject ? "Update" : "Add"} Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Skills Modal */}
      {showSkillsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Skill</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSkillsModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Skill Name
                  </label>
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Ex: JavaScript"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleAddSkill} className="flex-1">
                  Add Skill
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSkillsModal(false);
                    setNewSkill("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Certification Modal */}
      {showCertificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add Certification
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCertificationModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={certificationForm.name}
                    onChange={(e) =>
                      setCertificationForm({ ...certificationForm, name: e.target.value })
                    }
                    placeholder="Ex: AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Issuing Organization <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={certificationForm.issuingOrganization}
                    onChange={(e) =>
                      setCertificationForm({
                        ...certificationForm,
                        issuingOrganization: e.target.value,
                      })
                    }
                    placeholder="Ex: Amazon Web Services"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Issue Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="month"
                      value={certificationForm.issueDate}
                      onChange={(e) =>
                        setCertificationForm({ ...certificationForm, issueDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Expiration Date
                    </label>
                    <Input
                      type="month"
                      value={certificationForm.expirationDate}
                      onChange={(e) =>
                        setCertificationForm({
                          ...certificationForm,
                          expirationDate: e.target.value,
                        })
                      }
                      disabled={certificationForm.doesNotExpire}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="doesNotExpire"
                    checked={certificationForm.doesNotExpire}
                    onChange={(e) =>
                      setCertificationForm({
                        ...certificationForm,
                        doesNotExpire: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="doesNotExpire"
                    className="ml-2 text-sm text-gray-900 dark:text-gray-200"
                  >
                    This certification does not expire
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Credential ID
                  </label>
                  <Input
                    value={certificationForm.credentialId}
                    onChange={(e) =>
                      setCertificationForm({ ...certificationForm, credentialId: e.target.value })
                    }
                    placeholder="Ex: ABC123DEF456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Credential URL
                  </label>
                  <Input
                    value={certificationForm.credentialUrl}
                    onChange={(e) =>
                      setCertificationForm({ ...certificationForm, credentialUrl: e.target.value })
                    }
                    placeholder="https://credentials.example.com/verify/ABC123"
                    type="url"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleAddCertification} className="flex-1">
                  Add Certification
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCertificationModal(false);
                    setCertificationForm({
                      name: "",
                      issuingOrganization: "",
                      issueDate: "",
                      expirationDate: "",
                      credentialId: "",
                      credentialUrl: "",
                      doesNotExpire: false,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}