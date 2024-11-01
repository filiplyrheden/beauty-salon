<template>
  <div class="footer-container">
    <div class="footer">
      <div class="footer-top">
        <div class="contact">
          <div class="title">KONTAKTA MIG</div>
          <div class="phone">0761457735</div>
          <div class="email">
            <a href="mailto:info@snbeauty.se">info@snbeauty.se</a>
          </div>
          <div class="address">
            <a
              href="https://www.google.com/maps/place/Vasaplatsen+7B,+411+26+G%C3%B6teborg/@57.6993155,11.9686789,473"
              >VASAGATAN 2b, Göteborg</a
            >
          </div>

          <a href="https://www.bokadirekt.se/places/sn-beauty-56396">
            <button class="bokadirekt">BOKADIREKT</button></a
          >
        </div>
        <div class="page-links">
          <div class="title">LÄNKAR</div>
          <router-link to="/behandlingar">Behandlingar</router-link>
          <router-link to="/events">Events</router-link>
          <router-link to="kurser">Kurser</router-link>
          <router-link to="/about-me">Salongen</router-link>
          <router-link to="/shop">Shop</router-link>
          <router-link to="/user">Kundportal</router-link>
        </div>
        <div class="social-media">
          <div class="title">SOCIAL MEDIA</div>
          <a href="www.instagram.com">Instagram</a>
          <a href="www.facebook.com">Facebook</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="text">SN BEAUTY</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "FooterComponent",
};
</script>
<style scoped>
.footer-container {
  width: 100%;

  background-color: rgba(202, 193, 187, 1);
}
.footer {
  max-width: 1280px;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}
.footer-top {
  margin-top: 64px;
  padding: 0px 72px;
  display: flex;
  justify-content: space-between;
}
.footer-bottom {
  padding: 72px 72px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.contact,
.page-links,
.social-media {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.title {
  font-family: "Playfair Display", serif !important;
  letter-spacing: 5%;
  font-size: 1.5em;
  font-weight: 600;
  opacity: 0.5;
}

.bokadirekt {
  margin-top: 8px;
  width: 100%;
  padding: 8px 16px;
  font-family: "Playfair Display", serif !important;
  letter-spacing: 5%;
  font-weight: 600;
  background: black;
  color: white;
  border: 1px solid black;
  font-size: 18px;
  cursor: pointer;
}

.bokadirekt:hover {
  background: white;
  color: rgba(32, 32, 32, 1);
}

.social-media a,
.page-links a,
.contact a {
  color: rgba(32, 32, 32, 1);
  text-decoration: none;
}

.text {
  font-family: "Playfair Display", serif !important;
  font-size: 196px;
  font-weight: 600;
  line-height: 218.17px;
  letter-spacing: 0.04em;
  text-align: left;
  opacity: 0.3;
}
</style>
