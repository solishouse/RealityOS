// src/content/staticContent.ts

const content = {
  // Day 1 Content
  day1: {
    title: "Expose Your Reality",
    intro: {
      description: "Today, we're going to surface everything that's been weighing on your mind. No judgment, no analysis yet - just honest acknowledgment of what you're experiencing.",
      objectives: [
        "Identify and list your current problems and challenges",
        "Separate internal struggles from external circumstances",
        "Begin to see patterns in what's troubling you",
        "Create a complete picture of your current reality"
      ]
    },
    buttons: {
      start: "Let's Begin",
      continue: "Continue",
      complete: "Complete Day 1",
      skip: "Skip this one",
      back: "Back",
      dashboard: "Dashboard"
    },
    problemCollection: {
      title: "What's Really Going On?",
      description: "List everything that's bothering you, holding you back, or causing you stress. Be specific and honest - this is just for you.",
      internalPlaceholder: "e.g., 'I constantly doubt myself', 'I can't stop procrastinating'",
      externalPlaceholder: "e.g., 'My boss is micromanaging me', 'Traffic is terrible'",
      internalExamples: [
        "I feel anxious about the future",
        "I can't stop comparing myself to others",
        "I procrastinate on important tasks",
        "I doubt my abilities constantly"
      ],
      externalExamples: [
        "My workplace is toxic",
        "My partner doesn't understand me",
        "Money is tight this month",
        "My family has too many expectations"
      ]
    },
    categorization: {
      title: "Understanding the Roots",
      question: "What's the deeper root of this problem?",
      categories: {
        conditioning: {
          name: "Conditioning",
          description: "Patterns learned from past experiences, family, or society",
          subcategories: [
            {
              id: "childhood",
              name: "Childhood experiences",
              description: "Patterns formed in early years that still affect you"
            },
            {
              id: "family",
              name: "Family patterns",
              description: "Behaviors and beliefs inherited from family dynamics"
            },
            {
              id: "cultural",
              name: "Cultural/societal programming",
              description: "Expectations and norms from society that shaped you"
            },
            {
              id: "trauma",
              name: "Past trauma or wounds",
              description: "Unresolved experiences that created protective patterns"
            }
          ]
        },
        mind: {
          name: "Mind",
          description: "Mental patterns, thoughts, and cognitive habits",
          subcategories: [
            {
              id: "beliefs",
              name: "Limiting beliefs",
              description: "Thoughts about what's possible or impossible for you"
            },
            {
              id: "stories",
              name: "Stories you tell yourself",
              description: "Narratives you've created about who you are"
            },
            {
              id: "fears",
              name: "Fear-based thinking",
              description: "Thoughts driven by fear of failure, rejection, or loss"
            },
            {
              id: "comparison",
              name: "Comparison and judgment",
              description: "Measuring yourself against others or impossible standards"
            }
          ]
        },
        emotional: {
          name: "Emotional",
          description: "Unprocessed emotions and feeling patterns",
          subcategories: [
            {
              id: "suppressed",
              name: "Suppressed emotions",
              description: "Feelings you've pushed down or avoided"
            },
            {
              id: "triggers",
              name: "Emotional triggers",
              description: "Situations that provoke strong emotional reactions"
            },
            {
              id: "attachment",
              name: "Attachment patterns",
              description: "How you connect (or disconnect) in relationships"
            },
            {
              id: "worth",
              name: "Self-worth issues",
              description: "Deep feelings about your value and deservingness"
            }
          ]
        }
      }
    },
    summary: {
      title: "Your Reality Map",
      subtitle: "Here's what you've uncovered about your current reality",
      insights: [
        "Most of our problems share common roots",
        "Internal problems often create or amplify external ones",
        "Awareness is the first step to transformation",
        "You've just completed the hardest part - being honest with yourself"
      ]
    }
  },

  // Onboarding Content
  onboarding: {
    headers: {
      title: "Welcome to RealityOS!",
      subtitle: "Let's personalize your journey",
      titleStep2: "Set Your Intention",
      subtitleStep2: "What transformation are you seeking?"
    },
    steps: {
      name: {
        label: "What should we call you?",
        placeholder: "Enter your first name",
        helper: "This is how we'll address you throughout the program"
      },
      goal: {
        label: "What do you hope to achieve with RealityOS?",
        placeholder: "Describe your goal or the change you're seeking...",
        helper: "This will be your north star throughout the 28-day journey"
      }
    },
    buttons: {
      continue: "Continue",
      startJourney: "Start Your Journey",
      skip: "Skip for now (you can add this later)"
    },
    examples: {
      title: "Need inspiration? Here are some examples:",
      goals: [
        "Break free from self-limiting patterns",
        "Build unshakeable confidence",
        "Create the life I've been dreaming about",
        "Stop self-sabotage and follow through",
        "Align my actions with my true values",
        "Develop mental clarity and focus"
      ]
    },
    errors: {
      nameRequired: "Please enter your first name",
      goalRequired: "Please share what you hope to achieve",
      saveFailed: "Failed to save your information. Please try again."
    },
    footer: "Your 28-day transformation begins now"
  },

  // Profile Content
  profile: {
    headers: {
      title: "Your Profile",
      subtitle: "Manage your account and track your progress"
    },
    sections: {
      personal: {
        title: "Personal Information",
        firstName: "First Name",
        email: "Email Address",
        goal: "Your Goal"
      },
      progress: {
        title: "Your Progress",
        currentDay: "Current Day",
        streak: "Day Streak",
        completion: "Completion",
        weekProgress: "Week Progress"
      },
      subscription: {
        title: "Subscription",
        status: "Status",
        premium: "Premium Member",
        trial: "Free Trial",
        daysRemaining: "days remaining",
        upgrade: "Upgrade to Premium"
      },
      account: {
        title: "Account Settings",
        changePassword: "Change Password",
        notifications: "Email Notifications",
        deleteAccount: "Delete Account",
        signOut: "Sign Out"
      }
    },
    buttons: {
      edit: "Edit",
      save: "Save Changes",
      cancel: "Cancel",
      upgrade: "Upgrade",
      signOut: "Sign Out"
    },
    placeholders: {
      firstName: "Enter your first name",
      goal: "What do you want to achieve?"
    },
    messages: {
      updateSuccess: "Profile updated successfully",
      updateError: "Failed to update profile",
      signOutConfirm: "Are you sure you want to sign out?"
    }
  },

  // Dashboard Content
  dashboard: {
    welcome: {
      title: "Welcome back",
      dayCount: "Day {day} of your transformation journey",
      streak: "{count} day streak"
    },
    weekOverview: {
      week1: {
        title: "Align with your true self",
        subtitle: "Get clear on who you are and what's been holding you back",
        description: "This week, you'll identify the patterns and beliefs that have been running your life on autopilot. Through structured exercises, you'll uncover the roots of your struggles and reconnect with your authentic self.",
        topics: [
          "Expose the problems you're facing",
          "Identify root causes and patterns",
          "Map your current reality",
          "Clarify what you truly want",
          "Reconnect with your authentic self"
        ]
      },
      week2: {
        title: "Learn what shapes your reality",
        subtitle: "Understand the forces behind your results and patterns",
        description: "Dive deep into the mechanics of how thoughts, emotions, and actions create your experience. You'll learn the operating principles that determine what shows up in your life.",
        topics: [
          "The thought-emotion-action loop",
          "How beliefs become reality",
          "Understanding energy and frequency",
          "The role of the subconscious mind",
          "Breaking automatic patterns"
        ]
      },
      week3: {
        title: "Build your new operating system",
        subtitle: "Rewire how you think, feel, and show up every day",
        description: "Time to install your upgrades. You'll develop new mental models, emotional responses, and behavioral patterns aligned with who you're becoming.",
        topics: [
          "Design your ideal identity",
          "Create empowering beliefs",
          "Build new emotional patterns",
          "Develop aligned habits",
          "Practice embodiment exercises"
        ]
      },
      week4: {
        title: "Live what you've learned",
        subtitle: "Turn your inner work into everyday choices",
        description: "Integration week. You'll create sustainable practices and systems to maintain your new operating system in real-world conditions.",
        topics: [
          "Create your daily practice",
          "Build accountability systems",
          "Navigate challenges and setbacks",
          "Maintain momentum long-term",
          "Design your next chapter"
        ]
      }
    },
    progress: {
      title: "Your Journey",
      completed: "Completed",
      current: "Current",
      locked: "Locked",
      weekStatus: {
        complete: "Complete",
        inProgress: "In Progress",
        upcoming: "Upcoming",
        locked: "Locked"
      }
    },
    stats: {
      streak: {
        title: "Day Streak",
        subtitle: "Keep it going!"
      },
      progress: {
        title: "Progress",
        subtitle: "Day {current} of {total}"
      },
      goal: {
        title: "MY GOAL",
        placeholder: "Set your goal in your profile"
      }
    },
    lessons: {
      buttons: {
        start: "Start",
        resume: "Resume",
        view: "View",
        continue: "Continue"
      },
      status: {
        completed: "Completed",
        available: "Available",
        locked: "Locked"
      }
    },
    navigation: {
      viewOverview: "View Overview",
      close: "Close",
      back: "Back to Dashboard"
    }
  },

  // Navigation Content
  navigation: {
    menu: {
      dashboard: "Dashboard",
      progress: "Progress",
      profile: "Profile",
      settings: "Account Settings",
      notifications: "Notifications",
      subscription: "Manage Subscription",
      help: "Help & Support",
      signOut: "Sign Out"
    },
    user: {
      day: "Day",
      streak: "streak",
      premium: "Premium",
      freeTrial: "Free Trial"
    }
  },

  // Common/Shared Content
  common: {
    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Network error. Please check your connection.",
      unauthorized: "You don't have permission to do that.",
      notFound: "Page not found."
    },
    loading: {
      default: "Loading...",
      saving: "Saving...",
      updating: "Updating...",
      deleting: "Deleting..."
    },
    confirmation: {
      unsavedChanges: "You have unsaved changes. Are you sure you want to leave?",
      delete: "Are you sure you want to delete this? This action cannot be undone."
    },
    time: {
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
      today: "Today",
      yesterday: "Yesterday",
      week: "Week",
      month: "Month"
    }
  },

  // Week intros and other daily content can be added here
  weeks: {
    1: {
      intro: {
        title: "Week 1: Align with Your True Self",
        description: "This week is about getting radically honest with yourself. You'll identify what's not working, understand why, and begin to reconnect with who you really are beneath all the conditioning.",
        objectives: [
          "Surface and examine your current problems",
          "Identify the root causes of your struggles",
          "Map out your current reality",
          "Clarify what you truly want",
          "Begin reconnecting with your authentic self"
        ]
      }
    },
    2: {
      intro: {
        title: "Week 2: Understand Your Operating System",
        description: "Now that you see what's happening, let's understand WHY it's happening. This week reveals the hidden mechanics that create your reality.",
        objectives: [
          "Learn how thoughts create emotions and actions",
          "Understand your subconscious programming",
          "Identify your dominant frequency",
          "Recognize your manifestation patterns",
          "See how beliefs shape your reality"
        ]
      }
    },
    3: {
      intro: {
        title: "Week 3: Install Your Upgrades",
        description: "Time to build your new operating system. This week, you'll actively rewire your thoughts, emotions, and behaviors to align with who you're becoming.",
        objectives: [
          "Design your ideal identity",
          "Install new empowering beliefs",
          "Create new emotional set points",
          "Build aligned daily habits",
          "Practice living as your future self"
        ]
      }
    },
    4: {
      intro: {
        title: "Week 4: Integrate and Embody",
        description: "The final week is about making your transformation sustainable. You'll create systems to maintain your growth and handle whatever life throws at you.",
        objectives: [
          "Create your personal practice",
          "Build accountability structures",
          "Develop resilience strategies",
          "Plan for long-term success",
          "Design your next chapter"
        ]
      }
    }
  }
}

export default content