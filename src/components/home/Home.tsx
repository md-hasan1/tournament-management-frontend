import React from "react";
import HeroSection from "./HeroSection";
import UpcomingTournaments from "./UpcomingTournaments";
import ConcreteFieldStory from "./ConcreteFieldStory";
import HowItWorks from "./HowItWorks";
import WhySmallSidedSoccer from "./WhySmallSidedSoccer";
import ForEveryPlayer from "./ForEveryPlayer";

function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingTournaments />
      <ConcreteFieldStory />
      <HowItWorks />
      <WhySmallSidedSoccer />
      <ForEveryPlayer />
      {/* <FoundersBundle /> */}
    </div>
  );
}

export default Home;
