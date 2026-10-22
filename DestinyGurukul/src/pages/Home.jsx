
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import SubjectCard from "../components/SubjectCard";
import TutorCard from "../components/TutorCard";
import WorksCard from "../components/WorksCard";
import Stats from "../components/Status";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Search */}
      <SearchBar />

      {/* Statistics */}
      <Stats />

      {/* Popular Subjects */}
      <SubjectCard />

      {/* Featured Tutors */}
      <TutorCard />

      {/* How It Works */}
      <WorksCard />

      {/* Call To Action */}
      <CTA />
    </>
  );
}
