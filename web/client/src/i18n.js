import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    returnObjects: true,
    lng: "en.",
    resources: {
      en: {
        translation: {
          //auth pages
          sign_in: "Sign In",
          enter_email: "Enter Email",
          password: "Password",
          forgot_pass: "Forgot Password?",
          char_8: "At least 8 characters",
          upper_1: "1 uppercase letter",
          lower_1: "1 lowercase letter",
          num_1: "1 number",
          special_1: "1 special character",
          register: "Register",
          send_otp: "Send Otp",
          verify_otp: "Verify Otp",
          otp_note:
            "If you did not receive the OTP, please check your spam folder.",
          //dashbaords
          dashboard_analytics: "Analytics",
          dashboard_search: "Search",
          dashboard_donations: "Donations",
          //analytics
          analytics_sos_request: "SOS Requests",
          analytics_unverified_posts: "Total Unverified Posts",
          analytics_verified_post: "Total Verified Posts",
          analytics_sos_raised: "SOS Resolved Today",
          analytics_posts_scraped: "SOS Response Time",
          //fundraiser
          fundraiser_title: "Manage Donations",
          fundraiser_create_fund: "Create New Fundraiser",
          fundraiser_create_fund_title: "Title",
          fundraiser_create_fund_ff: "Full Form",
          fundraiser_create_fund_desc: "Description",
          fundraiser_create_fund_goal: "Goal Amount",
          fundraiser_create_fund_file: "Logo File",
          fundraiser_create_close: "Close",
          fundraiser_create_create_button: "Create Fundraiser",
          //sos sidebar
          sos_sidebar_request: "SOS Requests",
          sos_sidebar_emeergencyType: "Emergency Type: ",
          sos_sidebar_location: "Location:",
          sos_sidebar_date: "",
          sos_sidebar_time: "",
          sos_sidebar_resolve_button: "Resolve",
          sos_modal_resolver: "SOS Resolver",
          sos_modal_name: "Name:",
          sos_sidebar_email: "Email:",
          sos_button_close: "Close",
          sos_button_save: "Save Changes",
          //footer
          footer_description:
            '"AapdaMitra" is a software designed to help government and private agencies by providing real-time data collection from sources like social media, news websites, and open platforms.',
          footer_middle_div_1: "General",
          footer_middle_div_2: "Home",
          footer_middle_div_3: "Events",
          footer_middle_div_4: "Analysis",
          footer_middle_div_5: "NDRF",
          footer_middle_div_7: "Home",
          footer_middle_div_8: "About Us",
          footer_middle_div_9: "Contact Us",
          footer_middle_div_10: "NDRF Helpline Number",
        },
      },
      hi: {
        translation: {
          // auth pages
          sign_in: "साइन इन",
          enter_email: "ईमेल दर्ज करें",
          password: "पासवर्ड",
          forgot_pass: "पासवर्ड भूल गए?",
          char_8: "कम से कम 8 अक्षर",
          upper_1: "1 बड़े अक्षर",
          lower_1: "1 छोटे अक्षर",
          num_1: "1 संख्या",
          special_1: "1 विशेष अक्षर",
          register: "पंजीकरण करें",
          send_otp: "ओटीपी भेजें",
          verify_otp: "ओटीपी सत्यापित करें",
          otp_note:
            "यदि आपको ओटीपी प्राप्त नहीं हुआ है, तो कृपया अपने स्पैम फ़ोल्डर की जाँच करें।",

          // dashboards
          dashboard_analytics: "विश्लेषण",
          dashboard_search: "खोज",
          dashboard_donations: "दान",

          // analytics
          analytics_sos_request: "एसओएस अनुरोध",
          analytics_unverified_posts: "कुल अप्रत्याप्त पोस्ट",
          analytics_verified_post: "कुल सत्यापित पोस्ट",
          analytics_sos_raised: "आज उठाए गए एसओएस",
          analytics_posts_scraped: "आज स्क्रैप किए गए पोस्ट",

          // fundraiser
          fundraiser_title: "दान प्रबंधन करें",
          fundraiser_create_fund: "नया धन उगाहने वाला बनाएं",
          fundraiser_create_fund_title: "शीर्षक",
          fundraiser_create_fund_ff: "पूरा नाम",
          fundraiser_create_fund_desc: "विवरण",
          fundraiser_create_fund_file: "लोगो फ़ाइल",
          fundraiser_create_close: "बंद करें",
          fundraiser_create_create_button: "धन उगाहने वाला बनाएं",

          // footer
          footer_description:
            '"आपदा मित्र" एक सॉफ्टवेयर है जो सोशल मीडिया, समाचार वेबसाइटों और खुले प्लेटफ़ॉर्म जैसे स्रोतों से वास्तविक समय डेटा संग्रह प्रदान करके सरकारी और निजी एजेंसियों की मदद करता है।',
          footer_middle_div_1: "सामान्य",
          footer_middle_div_2: "होम",
          footer_middle_div_3: "कार्यक्रम",
          footer_middle_div_4: "विश्लेषण",
          footer_middle_div_5: "एनडीआरएफ",
          footer_middle_div_7: "होम",
          footer_middle_div_8: "हमारे बारे में",
          footer_middle_div_9: "संपर्क करें",
          footer_middle_div_10: "एनडीआरएफ हेल्पलाइन नंबर",
        },
      },
    },
  });
