import type { BlogPost } from "@/lib/modules/blog";

export const blogPostsData: BlogPost[] = [
  {
    id: "1",
    slug: "nutrition-guide",
    title: "Complete Nutrition Guide",
    excerpt:
      "Discover the basic principles of balanced eating and how to apply them in your daily life.",
    content: `<p>Nutrition is a fundamental pillar for maintaining a healthy lifestyle. Proper eating not only provides you with the energy needed for your daily activities but also strengthens your immune system and prevents diseases.</p>

<blockquote>"Let food be thy medicine and medicine be thy food." — Hippocrates</blockquote>

<h2>Proteins: The Building Block</h2>
<p>Proteins are essential for tissue repair and growth. Sources like chicken, fish, eggs, and legumes should be present in your daily diet. It is recommended to consume between <strong>1.6 and 2.2 grams</strong> of protein per kilogram of body weight.</p>

<h3>Recommended Protein Sources</h3>
<ul>
  <li>Chicken and turkey — up to 25g of protein per 100g</li>
  <li>Fish like salmon and tuna — rich in omega-3</li>
  <li>Eggs — the biological reference protein</li>
  <li>Legumes like lentils and chickpeas</li>
</ul>

<h2>Carbohydrates: Your Fuel</h2>
<p>Complex carbohydrates like oats, brown rice, and sweet potatoes provide you with <strong>sustained energy</strong> for your daily activities.</p>

<h3>Suggested Weekly Distribution</h3>
<table>
  <thead>
    <tr>
      <th>Day</th>
      <th>Breakfast</th>
      <th>Lunch</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monday</td>
      <td>Oats + banana</td>
      <td>Rice + chicken</td>
    </tr>
    <tr>
      <td>Wednesday</td>
      <td>Sweet potato + eggs</td>
      <td>Pasta + salmon</td>
    </tr>
    <tr>
      <td>Friday</td>
      <td>Toast + avocado</td>
      <td>Quinoa + beef</td>
    </tr>
  </tbody>
</table>

<h2>Healthy Fats</h2>
<p>Don't fear fats. Avocado, nuts, and olive oil are sources of healthy fats that support hormone production and vitamin absorption.</p>

<h3>Sample Daily Menu</h3>
<ol>
  <li><strong>Breakfast (7:00):</strong> Oats with berries and walnuts</li>
  <li><strong>Snack (10:00):</strong> Handful of almonds and an apple</li>
  <li><strong>Lunch (13:00):</strong> Chicken breast with brown rice and broccoli</li>
  <li><strong>Afternoon snack (16:00):</strong> Yogurt with granola</li>
  <li><strong>Dinner (21:00):</strong> Salmon with sweet potato and asparagus</li>
</ol>

<h2>Hydration: The Forgotten Factor</h2>
<p>Proper hydration can improve your performance by up to <strong>20%</strong>. Drink at least <code>2-3 liters</code> of water per day.</p>

<p>For personalized calculations:</p>
<pre><code>Daily water (L) = Weight (kg) × 0.033
Example: 70kg × 0.033 = 2.31L/day</code></pre>

<hr />

<p><em>Remember that every body is different. Consult a healthcare professional for personalized recommendations.</em></p>`,
    image: "https://placehold.co/600x400?text=Nutricion",
    author: "María García",
    category: "nutricion",
    tags: ["nutrition", "eating", "health"],
    publishedAt: "2025-12-15",
    readingTime: 5,
    attachments: [
      { name: "Product Catalog.pdf", url: "/medias/news/nutrition-guide/product-catalog.pdf", size: "2.4 MB" },
      { name: "Reference Guide.xlsx", url: "/medias/news/nutrition-guide/reference-guide.xlsx", size: "1.1 MB" },
      { name: "Report Template.docx", url: "/medias/news/nutrition-guide/report-template.docx", size: "856 KB" },
    ],
  },
  {
    id: "2",
    slug: "daily-organization",
    title: "How to Organize Your Daily Routine",
    excerpt:
      "A practical guide to structuring your day and maximizing your productivity with healthy habits.",
    content:
      "<p>A well-organized daily routine is the key to achieving consistent results in any area of your life. Whether you're looking to improve your productivity, your health, or your overall well-being, organizing your day makes all the difference.</p><h2>The Importance of Routine</h2><p>Having a structured routine reduces decision fatigue and frees up mental energy for what really matters. When you automate small decisions, your brain has more resources for important tasks.</p><h2>Productive Morning</h2><p>The first 30 minutes of your day set the tone for the rest. Wake up at the same time, hydrate, and spend time planning your day before checking your phone.</p><h2>Work Blocks</h2><p>Organize your time into 90-minute blocks with 10-15 minute breaks between each one. This technique, known as interval management, leverages your brain's natural concentration rhythms.</p><h2>Restorative Evening</h2><p>A consistent evening routine (no screens 1 hour before bed, light reading, cool temperature) significantly improves sleep quality and recovery for the next day.</p>",
    image: "https://placehold.co/600x400?text=Entrenamiento",
    author: "Carlos López",
    category: "productividad",
    tags: ["routine", "organization", "habits"],
    publishedAt: "2025-11-20",
    readingTime: 7,
  },
  {
    id: "3",
    slug: "benefits-of-rest",
    title: "Benefits of Active Rest",
    excerpt:
      "Rest is essential for health and well-being. Learn why it's important and how to optimize your recovery.",
    content:
      "<p>Rest is probably the most underestimated component of a healthy life. Many believe that more activity is always better, but the reality is that the body and mind regenerate during rest.</p><h2>Why Is Rest Important?</h2><p>During daily activity, we generate physical and mental wear and tear. It's during rest that the body repairs tissues, consolidates memory, and recharges energy. Without adequate rest, performance declines.</p><h2>Quality Sleep</h2><p>Sleeping between 7 and 9 hours is crucial for health. During deep sleep, the body releases hormones essential for cell repair and the immune system.</p><h2>Active Rest Days</h2><p>An active rest day can include walks, gentle stretching, or reading. These activities promote circulation and help clear the mind without adding extra stress.</p>",
    image: "https://placehold.co/600x400?text=Descanso",
    author: "Ana Martínez",
    category: "salud",
    tags: ["rest", "recovery", "wellness"],
    publishedAt: "2025-10-10",
    readingTime: 4,
  },
  {
    id: "4",
    slug: "protein-benefits",
    title: "Benefits of Protein in Your Diet",
    excerpt:
      "Discover why protein is essential for your health and how to easily incorporate it into your daily meals.",
    content:
      "<p>Protein is one of the most important macronutrients for the functioning of the human body. From tissue repair to the production of enzymes and hormones, its functions are multiple and essential.</p><h2>Why Do We Need Protein?</h2><p>Proteins are made up of amino acids, which are the building blocks of the body. The human body uses proteins to build and repair tissues, produce enzymes and hormones, and maintain the health of bones, muscles, and skin.</p><h2>Sources of Protein</h2><p>There are animal sources (lean meats, fish, eggs, dairy) and plant sources (legumes, tofu, quinoa, nuts). A varied diet that includes both sources ensures a complete amino acid profile.</p><h2>How Much Protein Do I Need?</h2><p>The recommended amount varies depending on age, activity level, and individual goals. As a general reference, a consumption of 0.8 to 1.2 grams per kilogram of body weight per day is suggested.</p><h2>Practical Tips</h2><p>Including protein in every main meal helps maintain satiety and stabilize blood sugar levels. A handful of nuts, a hard-boiled egg, or a glass of milk are simple and effective options.</p>",
    image: "https://placehold.co/600x400?text=Proteina",
    author: "Laura Mendoza",
    category: "nutricion",
    tags: ["protein", "nutrition", "health"],
    publishedAt: "2025-09-05",
    readingTime: 4,
  },
];
