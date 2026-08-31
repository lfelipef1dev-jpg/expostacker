import { defineCollection, z } from 'astro:content';

const localizedString = z.object({
  pt: z.string(),
  en: z.string()
});

const casesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    clientName: z.string(),
    tags: z.array(z.string()),
    shortDescription: z.string().max(180).default(''),
    problemDescription: z.string(),
    technicalSolution: z.string(),
    businessOutcome: z.array(
      z.object({
        label: z.string(),
        value: z.union([z.number(), z.string()]),
        unit: z.string()
      })
    ),
    liveUrl: z.string().url(),
    demoAccess: z.object({
      email: z.string(),
      password: z.string()
    }).optional(),
    projectType: z.enum(['SaaS', 'Client-Work', 'Open-Source']),
    featured: z.boolean().default(false),
    category: z.enum(['personal', 'client', 'experiment', 'opensource', 'saas', 'ecommerce', 'ai', 'systems', 'site']).default('client').optional(),
    year: z.number().optional(),
    priority: z.number().optional(),
    hasCaseStudy: z.boolean().default(true),
    heroHeadline: localizedString.optional(),
    heroSubhead: localizedString.optional(),
    heroImage: z.string().optional(),
    opening: localizedString.optional(),
    challengeContext: localizedString.optional(),
    approach: localizedString.optional(),
    solutionIntro: localizedString.optional(),
    solutionItems: z.object({
      pt: z.array(z.string()),
      en: z.array(z.string())
    }).optional(),
    decisionLog: z.array(
      z.object({
        title: localizedString,
        why: localizedString,
        alternatives: localizedString
      })
    ).optional(),
    technologies: z.array(
      z.object({
        name: z.string(),
        why: localizedString
      })
    ).optional(),
    myRole: localizedString.optional(),
    lessonsLearned: localizedString.optional(),
    stakeholders: localizedString.optional(),
    sector: localizedString.optional(),
    heroMetrics: z.array(
      z.object({
        value: z.string(),
        label: localizedString
      })
    ).optional(),
    timeline: z.object({
      duration: z.string(),
      launchDate: z.string()
    }).optional(),
    timelinePhases: z.array(
      z.object({
        phase: z.string(),
        period: z.string(),
        items: z.object({
          pt: z.array(z.string()),
          en: z.array(z.string())
        })
      })
    ).optional(),
    nda: z.boolean().default(false),
    visualDisclaimer: localizedString.optional(),
    methodology: z.object({
      pt: z.array(z.string()),
      en: z.array(z.string())
    }).optional(),
    aiPipeline: z.object({
      pt: z.object({
        title: z.string(),
        steps: z.array(z.string())
      }),
      en: z.object({
        title: z.string(),
        steps: z.array(z.string())
      })
    }).optional(),
    gamification: z.object({
      pt: z.object({
        title: z.string(),
        mechanics: z.array(z.object({
          name: z.string(),
          desc: z.string()
        }))
      }),
      en: z.object({
        title: z.string(),
        mechanics: z.array(z.object({
          name: z.string(),
          desc: z.string()
        }))
      })
    }).optional(),
    security: z.object({
      pt: z.object({
        title: z.string(),
        items: z.array(z.string())
      }),
      en: z.object({
        title: z.string(),
        items: z.array(z.string())
      })
    }).optional(),
    techStack: z.object({
      pt: z.object({
        title: z.string(),
        categories: z.array(z.object({
          category: z.string(),
          items: z.array(z.object({
            name: z.string(),
            why: z.string(),
            alt: z.string()
          }))
        }))
      }),
      en: z.object({
        title: z.string(),
        categories: z.array(z.object({
          category: z.string(),
          items: z.array(z.object({
            name: z.string(),
            why: z.string(),
            alt: z.string()
          }))
        }))
      })
    }).optional(),
    architecture: z.object({
      pt: z.object({
        title: z.string(),
        items: z.array(z.string())
      }),
      en: z.object({
        title: z.string(),
        items: z.array(z.string())
      })
    }).optional(),
    architectureDiagram: z.object({
      left: z.string(),
      leftSub: z.string().optional(),
      center: z.string(),
      centerSub: z.string().optional(),
      right: z.string(),
      rightSub: z.string().optional(),
      bottom: z.array(z.string()).optional()
    }).optional(),
    resultsDetail: z.object({
      pt: z.object({
        title: z.string(),
        kpis: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
            baseline: z.string().optional(),
            source: z.string().optional(),
            sparkline: z.array(z.number()).optional()
          })
        )
      }),
      en: z.object({
        title: z.string(),
        kpis: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
            baseline: z.string().optional(),
            source: z.string().optional(),
            sparkline: z.array(z.number()).optional()
          })
        )
      })
    }).optional()
  })
});

export const collections = {
  'cases': casesCollection,
};
