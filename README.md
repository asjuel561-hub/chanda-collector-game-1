# চাঁদা কালেক্টর: বাজারে গণধাওয়া

Three.js + Vite দিয়ে তৈরি একটি browser-based 3D third-person comedy chase prototype। কাল্পনিক চরিত্র, বাজারের পরিবেশ, AI-ধাওয়া, ক্ষোভের মিটার, বাংলা সাবটাইটেল, browser speech synthesis ও procedural ambience অন্তর্ভুক্ত।

## প্রয়োজনীয় সফটওয়্যার
- Node.js 20.19+ বা 22.12+ (Vite 7-এর জন্য)
- Chrome, Edge বা Firefox-এর আধুনিক সংস্করণ

## চালানোর নিয়ম
1. ZIP ফাইলটি Extract করুন।
2. টার্মিনাল/Command Prompt-এ এই ফোল্ডারে যান।
3. চালান:

   ```bash
   npm install
   npm run dev
   ```

4. টার্মিনালে দেখানো স্থানীয় URL (সাধারণত `http://localhost:5173`) ব্রাউজারে খুলুন।
5. Build তৈরি করতে:

   ```bash
   npm run build
   npm run preview
   ```

## কন্ট্রোল
- `W A S D` অথবা Arrow keys: চলাফেরা
- `Space`: লাফ
- `Shift`: দ্রুত দৌড়
- `E`: ইন্টারঅ্যাকশন (কাল্পনিক দোকানদারের প্রতিবাদ ও ক্ষোভ বাড়ে)
- মাউস: Third-person ক্যামেরা ঘোরানো
- মোবাইল: টাচ জয়স্টিক, লাফ ও দৌড় বাটন

## অডিও
অডিও ব্রাউজারের Web Audio API দিয়ে procedural ambience ও টোন তৈরি করে। বাংলা সংলাপ `SpeechSynthesis` ব্যবহার করে; সঠিক বাংলা ভয়েস পাওয়া যাবে কি না তা অপারেটিং সিস্টেম/ব্রাউজারে ইনস্টল থাকা voice-এর ওপর নির্ভর করে। শব্দ চালু করতে প্রথমে **গেম শুরু করুন** চাপতে হবে।

## নোট
- এটি একটি playable prototype, পূর্ণ বাণিজ্যিক গেম নয়।
- মডেল ও পরিবেশ procedural geometry দিয়ে তৈরি; বাস্তবসম্মত বাজারের ভিত্তি থাকলেও এখনো bespoke photorealistic asset নয়।
- Game Over-এ রক্তাক্ত সহিংসতা নেই; slapstick comedy ব্যবহার করা হয়েছে।
- গেমের চরিত্র ও পরিস্থিতি কাল্পনিক ব্যঙ্গাত্মক উপস্থাপনা।
