<template>
    <div>
        <CreateEvent @event-created="handleEventCreated" />
        <EventList :items="eventItems" @event-deleted="handleEventDelete" />
    </div>
</template>

<script>
import axiosInstance from '@/services/axiosConfig';
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
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get("/admin/events", {
                    headers: {
                Authorization: `Bearer ${token}`
                }
                });
                this.eventItems = response.data; // Assign API response to items
            } catch (error) {
                console.error("Error fetching events:", error); // Log error for debugging
            }
        },
        getImageUrl(imageName) {
        return `${process.env.VUE_APP_API_BASE_URL}${imageName}`;
        },
        handleEventDelete(eventId) {
            // Remove the deleted event from the eventItems array
            this.eventItems = this.eventItems.filter(event => event.event_id !== eventId);
        },
        handleEventCreated(newEvent) {
            // Add the new event to the event list without re-fetching from the API
            this.eventItems.push(newEvent);
        }
    }
};
</script>

<style>
</style>
