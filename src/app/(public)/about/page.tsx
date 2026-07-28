import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { siteConfig } from "@/constants/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "th" ? "เกี่ยวกับเรา" : "About Us",
    description:
      locale === "th"
        ? "ของแต่งเล็ก ๆ ที่ทำให้ทุกวันสนุกขึ้น — รู้จักกับ eiei แบรนด์สติ๊กเกอร์และของตกแต่ง"
        : "Small things, big smiles — get to know eiei, your friendly sticker and lifestyle brand",
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const url = `${siteConfig.url}/about`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About eiei",
    description:
      locale === "th"
        ? "ของแต่งเล็ก ๆ ที่ทำให้ทุกวันสนุกขึ้น"
        : "Small things, big smiles.",
    url,
  };

  if (locale === "en") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-[var(--font-heading)] prose-p:font-[var(--font-content)] prose-a:text-[var(--link)] hover:prose-a:text-[var(--link-hover)]">
          <h1>About eiei</h1>

          <h2>Small Things, Big Smiles.</h2>
          <p>
            At eiei, we believe that even the smallest details can brighten someone&apos;s day.
          </p>
          <p>
            Founded by a small independent team, eiei was created with a simple vision: to offer
            thoughtfully designed stickers and decorative products while sharing creative ideas and
            useful knowledge with people who enjoy personalizing their everyday lives.
          </p>
          <p>
            More than just an online store, eiei is a place where creativity, inspiration, and
            self-expression come together.
          </p>

          <h2>Who We Are</h2>
          <p>
            eiei is a lifestyle brand under <strong>Picel Collections</strong>, the creative hub
            behind a growing family of brands dedicated to products and services that are both
            accessible and thoughtfully designed.
          </p>
          <p>
            While Picel Collections serves as the parent brand, eiei focuses on online and offline
            lifestyle products, including decorative stickers, planner accessories, stationery
            decorations, and other creative items that bring more personality to everyday essentials.
          </p>
          <p>
            Although we are just beginning our journey, our goal is to continue expanding with
            products that inspire creativity and make everyday moments more enjoyable.
          </p>

          <h2>Who We Create For</h2>
          <p>
            Our primary community is made up of students, university students, and young creators who
            enjoy expressing themselves through small creative details.
          </p>
          <p>
            Whether you&apos;re decorating your notebooks, assignments, laptop, water bottle, bag,
            journal, or personal workspace, we hope our products become part of your daily
            inspiration.
          </p>

          <h2>More Than Products</h2>
          <p>
            At eiei, we believe creativity should be shared.
          </p>
          <p>
            Alongside our products, we publish articles, tips, and creative ideas about stickers,
            stationery, decoration, and everyday inspiration. We want our platform to be a place
            where people can discover new ideas, learn something useful, and enjoy being creative
            together.
          </p>
          <p>
            Our mission is not only to create products people love, but also to build a community
            where creativity is simple, accessible, and enjoyable for everyone.
          </p>

          <h2>Our Story</h2>
          <p>
            eiei is a newly established brand, and this is only the beginning of our journey.
          </p>
          <p>
            Every product, article, and idea we create reflects our commitment to quality,
            affordability, and meaningful design. As we continue to grow, we look forward to
            creating products and experiences that bring joy to our customers every day.
          </p>
          <p>Thank you for being part of the beginning of our story.</p>

          <h2>Get in Touch</h2>
          <p>
            We&apos;d love to hear from you. If you have any questions, suggestions, or simply want
            to stay connected, you can reach us through our official channels:
          </p>
          <ul>
            <li>Facebook Page</li>
            <li>Instagram</li>
            <li>LINE Official Account</li>
          </ul>
          <p>
            Thank you for visiting eiei. We look forward to creating something special with you.
          </p>
        </article>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-[var(--font-heading)] prose-p:font-[var(--font-content)] prose-a:text-[var(--link)] hover:prose-a:text-[var(--link-hover)]">
        <h1>About eiei</h1>

        <h2>ของแต่งเล็ก ๆ ที่ทำให้ทุกวันสนุกขึ้น</h2>
        <p>เราเชื่อว่า &ldquo;ของชิ้นเล็ก ๆ ก็สร้างรอยยิ้มได้&rdquo;</p>
        <p>
          eiei เกิดขึ้นจากความตั้งใจของทีมเล็ก ๆ ที่อยากสร้างแบรนด์ของตกแต่งและสติ๊กเกอร์ที่ใช้งานได้จริง
          พร้อมแบ่งปันไอเดียและความรู้ให้ทุกคนสนุกกับการตกแต่งสิ่งรอบตัว ไม่ว่าจะเป็นสมุด ใบงาน กระเป๋า
          แล็ปท็อป หรือของใช้ในชีวิตประจำวัน
        </p>
        <p>
          เราไม่ได้อยากเป็นแค่ร้านขายสติ๊กเกอร์ แต่เราอยากเป็นพื้นที่ที่รวมทั้งสินค้า ไอเดีย
          และบทความดี ๆ สำหรับคนที่ชอบงานตกแต่งเหมือนกัน
        </p>

        <h2>eiei คืออะไร?</h2>
        <p>
          eiei เป็นหนึ่งในแบรนด์ภายใต้ <strong>Picel Collections</strong> ซึ่งเป็นศูนย์กลางของแบรนด์สินค้า
          และบริการที่เรากำลังสร้างขึ้น โดยมีเป้าหมายเดียวกันคือ การส่งมอบสินค้าที่มีคุณภาพ
          ในราคาที่เข้าถึงง่าย และเป็นมิตรกับทุกคน
        </p>
        <p>
          ในอนาคต Picel Collections จะมีแบรนด์ย่อยหลายแบรนด์ที่ดูแลสินค้าและบริการในแต่ละหมวดหมู่
          ส่วน eiei จะเน้นสินค้าไลฟ์สไตล์ ทั้งแบบออนไลน์และออฟไลน์ เช่น สติ๊กเกอร์ตกแต่ง ของตกแต่ง
          และสินค้าเล็ก ๆ ที่ช่วยเพิ่มสีสันให้กับการเรียนและการใช้ชีวิต
        </p>

        <h2>เราทำเพื่อใคร?</h2>
        <p>สำหรับนักเรียน นักศึกษา และทุกคนที่ชอบตกแต่งสิ่งของของตัวเอง</p>
        <p>
          ไม่ว่าคุณจะกำลังแต่งสมุด แต่งใบงาน ตกแต่งโน้ตบุ๊ก กระเป๋า หรือกำลังมองหาของขวัญน่ารัก ๆ
          เราอยากให้ eiei เป็นอีกหนึ่งตัวเลือกที่ทำให้การใช้ชีวิตในแต่ละวันสนุกขึ้น
        </p>

        <h2>มากกว่าสินค้า</h2>
        <p>
          นอกจากสินค้าแล้ว เรายังตั้งใจแบ่งปันบทความ ความรู้ และไอเดียเกี่ยวกับสติ๊กเกอร์ งานตกแต่ง
          และของน่ารักต่าง ๆ เพื่อให้ทุกคนได้ทั้งแรงบันดาลใจและเทคนิคใหม่ ๆ อยู่เสมอ
        </p>
        <p>
          เราเชื่อว่าความคิดสร้างสรรค์ไม่จำเป็นต้องเริ่มจากของราคาแพง แต่เริ่มจากของชิ้นเล็ก ๆ
          ที่ทำให้เราอยากหยิบขึ้นมาใช้ทุกวัน
        </p>

        <h2>จุดเริ่มต้นของเรา</h2>
        <p>eiei ยังเป็นแบรนด์ใหม่ที่กำลังเติบโต และนี่คือก้าวแรกของพวกเรา</p>
        <p>
          แม้วันนี้จะเพิ่งเริ่มต้น แต่เราตั้งใจพัฒนาสินค้า เนื้อหา และประสบการณ์ที่ดีที่สุดให้กับทุกคน
          พร้อมเติบโตไปกับลูกค้าของเราในทุก ๆ วัน
        </p>
        <p>ขอบคุณที่แวะมาทำความรู้จักกับ eiei 💛</p>

        <h2>มาพูดคุยกับเรา</h2>
        <p>
          หากมีคำถาม ข้อเสนอแนะ หรืออยากติดตามข่าวสารและสินค้าใหม่ ๆ สามารถติดต่อเราได้ผ่าน
        </p>
        <ul>
          <li>Facebook Page</li>
          <li>Instagram</li>
          <li>LINE Official Account</li>
        </ul>
        <p>แล้วพบกันเร็ว ๆ นี้ ✨</p>
      </article>
    </main>
  );
}
