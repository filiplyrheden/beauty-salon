<template>
  <section class="about-us">
    <div class="hero">
      <h1>{{ title }}</h1>
    </div>
    <div class="section mission">
      <div class="mission-content">
        <img :src="shahadUrl" alt="Shahad Nasir" class="mission-image" />
        <p>{{ missionText }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import shahadUrl from "@/assets/shahad.png";

export default {
  name: "AboutUsPage",
  setup() {
    const title = ref("Om SNBeauty");
    const missionText = ref(
      "Shahad Nasir grundade Shahad consulting AB år 2020 & har sedan dess drivit sin salong på Vasaplatsen i Göteborg. Hon är utbildad i makeupartist och specialiserar sig på brudmakeup. Planerar du bröllop eller är du brudtärna? Boka in dig på en provsminkning så går vi igenom dina önskemål för att skapa en magisk sminkning."
    );

    onMounted(() => {
      console.log("About Us page loaded");
    });

    return {
      title,
      missionText,
      shahadUrl,
    };
  },
};
</script>

<style scoped>
.about-us {
  padding: 40px;
  font-family: Arial, sans-serif;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

/* Mission section styles */
.mission-content {
  display: flex;
  align-items: center;
}

.mission-image {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}
</style>
