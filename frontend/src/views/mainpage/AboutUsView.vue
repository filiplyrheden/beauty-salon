<template>
  <section class="about-us">
    <!-- Hero Section -->
    <div class="hero">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>

    <!-- Our Mission Section -->
    <div class="section mission">
      <h2>{{ missionTitle }}</h2>
      <p>{{ missionText }}</p>
    </div>

    <!-- Our Team Section -->
    <div class="section team">
      <h2>{{ teamTitle }}</h2>
      <div class="team-members">
        <div
          class="team-member"
          v-for="(member, index) in teamMembers"
          :key="index"
        >
          <img :src="member.image" :alt="member.name" class="team-image" />
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
        </div>
      </div>
    </div>

    <!-- Our Values Section -->
    <div class="section values">
      <h2>{{ valuesTitle }}</h2>
      <ul>
        <li v-for="(value, index) in valuesList" :key="index">{{ value }}</li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  name: "AboutUs",
  setup() {
    // Page content state
    const title = ref("About Us");
    const subtitle = ref("Learn more about our mission, team, and values.");

    // Mission section
    const missionTitle = ref("Our Mission");
    const missionText = ref(
      "We strive to deliver exceptional services that empower individuals and businesses to thrive."
    );

    // Team section
    const teamTitle = ref("Meet Our Team");
    const teamMembers = ref([
      {
        name: "John Doe",
        role: "CEO",
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Jane Smith",
        role: "CTO",
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Alice Johnson",
        role: "Lead Developer",
        image: "https://via.placeholder.com/150",
      },
    ]);

    // Values section
    const valuesTitle = ref("Our Values");
    const valuesList = ref([
      "Integrity",
      "Innovation",
      "Customer Satisfaction",
      "Teamwork",
      "Excellence",
    ]);

    // Lifecycle hook
    onMounted(() => {
      console.log("About Us page loaded");
    });

    // Return the data to the template
    return {
      title,
      subtitle,
      missionTitle,
      missionText,
      teamTitle,
      teamMembers,
      valuesTitle,
      valuesList,
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

.hero p {
  font-size: 1.25rem;
  color: #666;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.team-members {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.team-member {
  text-align: center;
}

.team-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.values ul {
  list-style-type: none;
  padding: 0;
}

.values li {
  font-size: 1.2rem;
  margin-bottom: 10px;
}
</style>
