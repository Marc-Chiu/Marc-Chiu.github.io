"use strict";
(function() {
  window.addEventListener("load", init);

  function init() {
    window.addEventListener('hashchange', navbar);
    window.addEventListener('scroll', navbar);
  }

  function navbar() {
    let profile = document.getElementById("profile");
    let experience = document.getElementById("experience");
    let skills = document.getElementById("skills");
    let projects = document.getElementById("projects");
    let contact = document.getElementById("contact");

    document.getElementById("nav-profile").classList.remove("active");
    document.getElementById("nav-experience").classList.remove("active");
    document.getElementById("nav-skills").classList.remove("active");
    document.getElementById("nav-projects").classList.remove("active");
    document.getElementById("nav-contact").classList.remove("active");

    let position =  window.scrollY;

    console.log(position);
    console.log(contact.offsetTop)
    console.log(projects.offsetTop)
    console.log(skills.offsetTop)
    console.log(experience.offsetTop)
    console.log(profile.offsetTop)

    if(position > projects.offsetTop + 150) {
     document.getElementById("nav-contact").classList.add("active");
    }
    else if(position > projects.offsetTop-100) {
     document.getElementById("nav-projects").classList.add("active");
    }
    else if(position > skills.offsetTop-100) {
     document.getElementById("nav-skills").classList.add("active");
    }
    else if(position > experience.offsetTop-100) {
     document.getElementById("nav-experience").classList.add("active");
    }
    else if(position > profile.offsetTop-100) {
     document.getElementById("nav-profile").classList.add("active");
   }
  }
})();
