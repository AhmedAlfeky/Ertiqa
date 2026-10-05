export type Database = {
  public: {
    Tables: {
      // 1. جداول الأمان والصلاحيات
      SEC_USERS: {
        Row: {
          user_id: number;
          auth_user_id: string;
          email: string;
          full_name: string | null;
          profile_picture_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: number;
          auth_user_id: string;
          email: string;
          full_name?: string | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: number;
          auth_user_id?: string;
          email?: string;
          full_name?: string | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      SEC_ROLES: {
        Row: {
          role_id: number;
          role_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          role_id?: number;
          role_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role_id?: number;
          role_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      SEC_USER_ROLES: {
        Row: {
          user_role_id: number;
          user_id: number;
          role_id: number;
          assigned_at: string;
        };
        Insert: {
          user_role_id?: number;
          user_id: number;
          role_id: number;
          assigned_at?: string;
        };
        Update: {
          user_role_id?: number;
          user_id?: number;
          role_id?: number;
          assigned_at?: string;
        };
      };

      // 2. ملفات المستخدمين والمدربين
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          specialization: string | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          website_url: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          youtube_url: string | null;
          is_instructor: boolean;
          instructor_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          specialization?: string | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          website_url?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          is_instructor?: boolean;
          instructor_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          specialization?: string | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          website_url?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          is_instructor?: boolean;
          instructor_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 3. الدورات وترجماتها
      courses: {
        Row: {
          id: number;
          instructor_id: string;
          slug: string;
          level_id: number | null;
          category_id: number | null;
          teaching_language_id: number;
          cover_image_url: string | null;
          promo_video_url: string | null;
          is_free: boolean;
          price: number | null;
          currency: string;
          is_published: boolean;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          instructor_id: string;
          slug: string;
          level_id?: number | null;
          category_id?: number | null;
          teaching_language_id?: number;
          cover_image_url?: string | null;
          promo_video_url?: string | null;
          is_free?: boolean;
          price?: number | null;
          currency?: string;
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          instructor_id?: string;
          slug?: string;
          level_id?: number | null;
          category_id?: number | null;
          teaching_language_id?: number;
          cover_image_url?: string | null;
          promo_video_url?: string | null;
          is_free?: boolean;
          price?: number | null;
          currency?: string;
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      course_translations: {
        Row: {
          id: number;
          course_id: number;
          language_id: number;
          title: string;
          subtitle: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          course_id: number;
          language_id: number;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          course_id?: number;
          language_id?: number;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 4. الوحدات التعليمية وترجماتها
      course_units: {
        Row: {
          id: number;
          course_id: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          course_id: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          course_id?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      course_unit_translations: {
        Row: {
          id: number;
          unit_id: number;
          language_id: number;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          unit_id: number;
          language_id: number;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          unit_id?: number;
          language_id?: number;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 5. الدروس وترجماتها
      lessons: {
        Row: {
          id: number;
          unit_id: number;
          order_index: number;
          lesson_type: string;
          video_url: string | null;
          video_duration: number | null;
          is_free_preview: boolean;
          passing_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          unit_id: number;
          order_index?: number;
          lesson_type?: string;
          video_url?: string | null;
          video_duration?: number | null;
          is_free_preview?: boolean;
          passing_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          unit_id?: number;
          order_index?: number;
          lesson_type?: string;
          video_url?: string | null;
          video_duration?: number | null;
          is_free_preview?: boolean;
          passing_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_translations: {
        Row: {
          id: number;
          lesson_id: number;
          language_id: number;
          title: string;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          lesson_id: number;
          language_id: number;
          title: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          lesson_id?: number;
          language_id?: number;
          title?: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 6. الاختبارات والأسئلة والخيارات
      quiz_questions: {
        Row: {
          id: number;
          lesson_id: number;
          order_index: number;
          question_type: string;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          lesson_id: number;
          order_index?: number;
          question_type?: string;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          lesson_id?: number;
          order_index?: number;
          question_type?: string;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_question_translations: {
        Row: {
          id: number;
          question_id: number;
          language_id: number;
          question_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          question_id: number;
          language_id: number;
          question_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          question_id?: number;
          language_id?: number;
          question_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_options: {
        Row: {
          id: number;
          question_id: number;
          order_index: number;
          is_correct: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          question_id: number;
          order_index?: number;
          is_correct?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          question_id?: number;
          order_index?: number;
          is_correct?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_option_translations: {
        Row: {
          id: number;
          option_id: number;
          language_id: number;
          option_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          option_id: number;
          language_id: number;
          option_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          option_id?: number;
          language_id?: number;
          option_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 7. جداول القوائم المرجعية (Lookups)
      lookup_categories: {
        Row: {
          id: number;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lookup_category_translations: {
        Row: {
          id: number;
          category_id: number;
          language_id: number;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          category_id: number;
          language_id: number;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          category_id?: number;
          language_id?: number;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lookup_levels: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lookup_languages: {
        Row: {
          id: number;
          code: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 8. التسجيلات والآراء (Enrollments & Testimonials)
      enrollments: {
        Row: {
          id: number;
          user_id: string;
          course_id: number;
          status: string;
          enrolled_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          course_id: number;
          status?: string;
          enrolled_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          course_id?: number;
          status?: string;
          enrolled_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      act_testimonials: {
        Row: {
          id: number;
          name: string | null;
          job_title: string | null;
          content: string;
          photo_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          job_title?: string | null;
          content: string;
          photo_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          job_title?: string | null;
          content?: string;
          photo_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      v_courses_full: {
        Row: {
          id: number;
          slug: string;
          instructor_id: string | null;
          instructor_name: string | null;
          instructor_avatar: string | null;
          category_id: number | null;
          level_id: number | null;
          teaching_language_id: number | null;
          cover_image_url: string | null;
          promo_video_url: string | null;
          is_free: boolean | null;
          price: number | null;
          currency: string | null;
          is_published: boolean | null;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string | null;
          updated_at: string | null;
          title_ar: string | null;
          subtitle_ar: string | null;
          description_ar: string | null;
          title_en: string | null;
          subtitle_en: string | null;
          description_en: string | null;
          units_count: number | null;
          lessons_count: number | null;
          students_count: number | null;
          avg_rating: number | null;
        };
      };
    };
  };
};
