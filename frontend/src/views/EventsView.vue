<template>
    <div>
        <EventList :items="eventItems" @event-deleted="handleEventDelete" />
        <CreateEvent />
    </div>
</template>

<script>
import axios from 'axios';
import EventList from '@/components/EventList.vue';
import CreateEvent from '@/components/CreateEvent.vue';

export default {
    name: "EventPage",
    components: {
        CreateEvent,
        EventList,
    },
    data() {
        return {
            eventItems: [], // Initialize an empty array for event items
        }
    },
    created() {
        this.getEvents(); // Fetch events once when the component is created
    },
    methods: {
        async getEvents() {
            try {
                const response = await axios.get("http://localhost:3000/admin/events");
                this.eventItems = response.data; // Assign API response to items
            } catch (error) {
                console.error("Error fetching events:", error); // Log error for debugging
            }
        },
        handleEventDelete(eventId) {
            // Remove the deleted event from the eventItems array
            this.eventItems = this.eventItems.filter(event => event.event_id !== eventId);
        },
    }
};
</script>

<style>
/* Add your styles here */
</style>
