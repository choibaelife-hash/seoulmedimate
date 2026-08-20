export type MockHospital = {
  id: string
  slug: string
  name: string
  name_ko: string
  specialty: '피부과' | '성형외과' | '치과' | '정형외과' | '내과'
  specialties: string[]
  district: string
  address: string
  phone: string
  description: string
  languages: string[]
  rating: number
  review_count: number
  is_verified: boolean
  is_premium: boolean
  image_url: string
  price_range: string
}

export const SPECIALTIES = ['전체', '피부과', '성형외과', '치과', '정형외과', '내과'] as const

export const MOCK_HOSPITALS: MockHospital[] = [
  // 피부과
  {
    id: '1', slug: 'glow-dermatology', name: 'Glow Dermatology Clinic', name_ko: '글로우 피부과',
    specialty: '피부과', specialties: ['피부과', '레이저', '보톡스'],
    district: 'Gangnam', address: '서울 강남구 테헤란로 123',
    phone: '+82-2-1234-5678',
    description: 'Glow Dermatology Clinic is one of Seoul\'s most trusted skin care destinations, serving international patients for over 15 years. Our board-certified dermatologists specialize in advanced laser treatments, anti-aging procedures, and skin rejuvenation using the latest FDA-approved technology. Each patient receives a personalized skin analysis before treatment, followed by a custom care plan designed around their skin type, lifestyle, and aesthetic goals. We offer multilingual medical coordinators fluent in English, Chinese, and Japanese, ensuring seamless communication from first consultation through aftercare. Our clinic is fully equipped with Fraxel, PicoSure, Ulthera, and RF lifting devices, covering everything from acne scarring to deep anti-aging. We welcome patients who are visiting Korea specifically for skin treatments and offer medical tourism packages including hospital transfer and accommodation recommendations.',
    languages: ['English', 'Chinese', 'Japanese'], rating: 4.9, review_count: 312,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€'
  },
  {
    id: '2', slug: 'seoul-skin-center', name: 'Seoul Skin Center', name_ko: '서울 피부센터',
    specialty: '피부과', specialties: ['피부과', '여드름', '색소치료'],
    district: 'Hongdae', address: '서울 마포구 홍익로 45',
    phone: '+82-2-2345-6789',
    description: 'Seoul Skin Center is a comprehensive dermatology clinic located in the vibrant Hongdae district, open 7 days a week to accommodate travelers and busy schedules. We specialize in treating acne, hyperpigmentation, rosacea, and uneven skin tone using a combination of medical-grade peels, targeted laser therapy, and prescription-strength topical treatments. Our team includes two fluent English-speaking dermatologists who trained at Seoul National University Hospital. Patients praise our transparent pricing and thorough consultation process, where every treatment option is clearly explained. We also offer teledermatology follow-up services so international patients can continue their care remotely after returning home. Same-day appointments are often available for urgent consultations.',
    languages: ['English', 'French'], rating: 4.7, review_count: 198,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '3', slug: 'k-beauty-clinic', name: 'K-Beauty Medical Clinic', name_ko: 'K뷰티 의원',
    specialty: '피부과', specialties: ['피부과', '필러', '스킨케어'],
    district: 'Apgujeong', address: '서울 강남구 압구정로 67',
    phone: '+82-2-3456-7890',
    description: 'K-Beauty Medical Clinic sits at the heart of Apgujeong\'s luxury beauty corridor, offering the most sought-after aesthetic treatments in Korea. We combine traditional Korean beauty philosophy with cutting-edge medical science to deliver results that are natural, long-lasting, and culturally attuned. Our signature treatments include hyaluronic acid filler sculpting, Botox refinement, PDRN skin regeneration, and the famous "glass skin" multi-layer hydration protocol that Korean celebrities rely on. We have internationally certified dermatologists who completed fellowships in Europe and the United States. All consultations are available in English, German, and Spanish. Complimentary skin photography and 3D facial analysis are included with every first visit.',
    languages: ['English', 'German', 'Spanish'], rating: 4.8, review_count: 445,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€'
  },
  {
    id: '4', slug: 'clear-skin-clinic', name: 'Clear Skin Clinic', name_ko: '클리어스킨 의원',
    specialty: '피부과', specialties: ['피부과', '아토피', '건선'],
    district: 'Itaewon', address: '서울 용산구 이태원로 89',
    phone: '+82-2-4567-8901',
    description: 'Clear Skin Clinic in Itaewon is a specialist clinic dedicated to the evidence-based treatment of chronic inflammatory skin conditions including atopic dermatitis, psoriasis, eczema, and contact dermatitis. Our dermatologists use a functional medicine approach, addressing internal triggers such as gut health, stress, and diet alongside topical and systemic treatments. We have significant experience treating patients from the Middle East and offer Arabic-speaking medical coordinators. Biological therapy (Dupixent, Tremfya) consultations are available for severe cases, and we can coordinate with your home country physician for medication continuity. We also offer full allergy patch testing panels for patients with suspected contact sensitivities.',
    languages: ['English', 'Arabic'], rating: 4.6, review_count: 134,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '5', slug: 'radiance-derma', name: 'Radiance Dermatology', name_ko: '레이디언스 피부과',
    specialty: '피부과', specialties: ['피부과', 'IPL', '리프팅'],
    district: 'Sinchon', address: '서울 서대문구 신촌로 12',
    phone: '+82-2-5678-9012',
    description: 'Radiance Dermatology is a technology-forward skin clinic based in Sinchon, specializing in light-based therapies for skin clarity, firmness, and tone correction. Our clinic houses industry-leading devices including the Lumenis M22 IPL platform, Thermage FLX for skin tightening, and the InMode Morpheus8 radiofrequency microneedling system. We treat sun damage, vascular lesions, redness, and skin laxity with precision and minimal downtime. Our practitioners include a former hospital research dermatologist who contributed to published studies on IPL efficacy in Asian skin types. English and Mandarin consultations are available on weekdays. Results are documented with standardized VISIA skin analysis photography before and after each treatment course.',
    languages: ['English', 'Chinese'], rating: 4.5, review_count: 89,
    is_verified: false, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '6', slug: 'pure-skin-seoul', name: 'Pure Skin Seoul', name_ko: '퓨어스킨 서울',
    specialty: '피부과', specialties: ['피부과', '미백', '모공'],
    district: 'Myeongdong', address: '서울 중구 명동길 34',
    phone: '+82-2-6789-0123',
    description: 'Pure Skin Seoul is conveniently located in Myeongdong, one of Seoul\'s most accessible tourist districts, making it the ideal choice for visitors seeking quick, effective skin treatments during a short stay. We specialize in brightening treatments and pore minimization using a combination of medical-grade Vitamin C infusions, niacinamide peels, and laser toning. No appointment is always needed — walk-ins are welcome for basic consultations. Our multilingual staff can communicate in English, Japanese, and Chinese, and we offer a "Skin Souvenir Package" designed for travelers: a single intensive treatment session with a take-home product kit and remote aftercare via WhatsApp. Prices are fully transparent and listed on our website.',
    languages: ['English', 'Japanese', 'Chinese'], rating: 4.4, review_count: 267,
    is_verified: true, is_premium: false, image_url: '', price_range: '€'
  },
  {
    id: '7', slug: 'derma-plus', name: 'Derma Plus Clinic', name_ko: '더마플러스',
    specialty: '피부과', specialties: ['피부과', '탈모', '두피'],
    district: 'Gangnam', address: '서울 강남구 역삼로 56',
    phone: '+82-2-7890-1234',
    description: 'Derma Plus Clinic is Seoul\'s leading specialist in hair loss and scalp health, offering a full range of medical and procedural interventions for both men and women experiencing alopecia, thinning, or scalp disorders. Our trichologists have over 12 years of experience diagnosing androgenic alopecia, alopecia areata, telogen effluvium, and scarring hair loss using digital scalp microscopy and laboratory bloodwork. Treatment options include PRP (platelet-rich plasma) hair injections, low-level laser therapy, prescription topicals, and referral for hair transplant consultations. We serve a growing population of Vietnamese and Southeast Asian patients and offer Vietnamese-language coordination. All treatment plans are documented and sharable with your physician at home for follow-up continuity.',
    languages: ['English', 'Vietnamese'], rating: 4.6, review_count: 156,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '8', slug: 'skin-lab-korea', name: 'Skin Lab Korea', name_ko: '스킨랩 코리아',
    specialty: '피부과', specialties: ['피부과', '항노화', '재생치료'],
    district: 'Cheongdam', address: '서울 강남구 청담동 78',
    phone: '+82-2-8901-2345',
    description: 'Skin Lab Korea is a premium, invitation-preferred anti-aging clinic in Cheongdam, catering to discerning international patients who seek the most advanced regenerative skin treatments available in Korea. Our protocols include exosome therapy, stem cell-derived growth factor serums, injectable polynucleotide (PDRN), NAD+ infusions, and collagen biostimulators such as Radiesse and Sculptra. Every patient undergoes a full biomarker health panel before treatment to ensure safety and optimize outcomes. Our medical director trained at Johns Hopkins and the Seoul National University Hospital and brings an integrative, science-first approach to aesthetic medicine. Consultations are available in English, Russian, and Mandarin. Discreet VIP scheduling is available for patients who require privacy.',
    languages: ['English', 'Russian', 'Chinese'], rating: 4.9, review_count: 89,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€€'
  },

  // 성형외과
  {
    id: '9', slug: 'id-hospital', name: 'ID Hospital', name_ko: 'ID 병원',
    specialty: '성형외과', specialties: ['성형외과', '눈성형', '코성형'],
    district: 'Apgujeong', address: '서울 강남구 압구정로 100',
    phone: '+82-2-9012-3456',
    description: 'ID Hospital is one of Korea\'s most internationally recognized plastic surgery centers, having performed over 100,000 surgeries since its founding and serving patients from more than 80 countries. Specializing in facial procedures including double eyelid surgery, rhinoplasty, and facial bone contouring, ID Hospital is staffed by 15 board-certified plastic surgeons who collaborate on complex cases to deliver consistent, natural-looking outcomes. The hospital maintains a dedicated international patient center with coordinators fluent in English, Chinese, Japanese, and Thai who assist with everything from consultation to post-op accommodation. Recovery suites are available on-site, and 24-hour nursing care is included for surgical patients. All before-and-after photos in our portfolio are from real patients with documented consent.',
    languages: ['English', 'Chinese', 'Japanese', 'Thai'], rating: 4.8, review_count: 1203,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€€'
  },
  {
    id: '10', slug: 'view-plastic-surgery', name: 'View Plastic Surgery', name_ko: '뷰 성형외과',
    specialty: '성형외과', specialties: ['성형외과', '지방흡입', '가슴성형'],
    district: 'Gangnam', address: '서울 강남구 강남대로 200',
    phone: '+82-2-0123-4567',
    description: 'View Plastic Surgery in Gangnam is a leading body contouring and breast surgery clinic trusted by international patients seeking transformative results with safety as the top priority. Our team of surgeons specializes in vaser liposuction, laser lipolysis, abdominoplasty, and breast augmentation using the latest anatomical implants and fat transfer techniques. We are one of the few clinics in Korea certified to use Motiva implants for breast surgery, offering a 10-year safety guarantee. All procedures are performed under general anesthesia administered by board-certified anesthesiologists. Post-operative care includes compression garment fitting, lymphatic drainage massage, and telemedicine follow-up with our surgeons. Our international patient team speaks English, Spanish, and Portuguese.',
    languages: ['English', 'Spanish', 'Portuguese'], rating: 4.7, review_count: 567,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€€'
  },
  {
    id: '11', slug: 'namu-plastic', name: 'Namu Plastic Surgery', name_ko: '나무 성형외과',
    specialty: '성형외과', specialties: ['성형외과', '안면윤곽', '두상성형'],
    district: 'Sinchon', address: '서울 서대문구 신촌로 150',
    phone: '+82-2-1111-2222',
    description: 'Namu Plastic Surgery is a facial contouring specialist clinic known for its natural, harmonious results that complement each patient\'s unique bone structure and ethnic features. Our surgeons are leaders in zygoma reduction, mandibular angle resection, chin advancement, and forehead augmentation — procedures that collectively reshape the facial silhouette without erasing individuality. We use 3D CT imaging for surgical planning, allowing patients to preview their expected bone changes before committing to surgery. Recovery is typically 2–3 weeks with swelling resolving over 3–6 months. Namu has been featured in multiple Korean medical journals for its outcomes in Asian facial bone contouring. Consultations in English and Chinese are available Monday through Saturday.',
    languages: ['English', 'Chinese'], rating: 4.6, review_count: 334,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },
  {
    id: '12', slug: 'oracle-clinic', name: 'Oracle Plastic Clinic', name_ko: '오라클 성형외과',
    specialty: '성형외과', specialties: ['성형외과', '쌍꺼풀', '매부리코'],
    district: 'Cheongdam', address: '서울 강남구 청담로 88',
    phone: '+82-2-2222-3333',
    description: 'Oracle Plastic Clinic in Cheongdam is an elite boutique surgical practice recognized for exquisite results in eyelid and nasal surgery. Our chief surgeon, Dr. Park, has been named among Korea\'s top 10 plastic surgeons in consecutive annual surveys and counts entertainment industry clients among his patients. Oracle specializes in non-incisional and incisional double eyelid surgery, ptosis correction, under-eye fat repositioning, hump reduction rhinoplasty, and tip refinement. Every surgical plan is custom-designed following a detailed photographic analysis and 3D consultation. We accommodate international patients with flexible scheduling, in-clinic interpreters for Arabic and Japanese-speaking patients, and a private recovery lounge. Testimonials from over 200 international patients are available on request.',
    languages: ['English', 'Japanese', 'Arabic'], rating: 4.9, review_count: 789,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€€'
  },
  {
    id: '13', slug: 'midas-surgery', name: 'Midas Aesthetic Surgery', name_ko: '마이다스 성형외과',
    specialty: '성형외과', specialties: ['성형외과', '복부성형', '허벅지'],
    district: 'Gangnam', address: '서울 강남구 도산대로 45',
    phone: '+82-2-3333-4444',
    description: 'Midas Aesthetic Surgery is a body specialist clinic in Gangnam offering transformative procedures for patients who have struggled with stubborn fat, loose skin after weight loss, or post-pregnancy body changes. Our surgeons specialize in full and mini abdominoplasty, inner thigh lift, arm lift (brachioplasty), and combination body sculpting using vaser lipo with skin tightening. We follow the "Midas Minimal Downtime Protocol," an evidence-based recovery plan that reduces post-surgical swelling by 40% and allows most patients to return to light activity within 10 days. Preoperative blood testing, compression fitting, and one follow-up scan are included in the surgical package price. Coordination in English, Thai, and Vietnamese is available through our international desk.',
    languages: ['English', 'Thai', 'Vietnamese'], rating: 4.5, review_count: 211,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },
  {
    id: '14', slug: 'dream-plastic', name: 'Dream Plastic Surgery', name_ko: '드림 성형외과',
    specialty: '성형외과', specialties: ['성형외과', '눈밑지방', '이마'],
    district: 'Apgujeong', address: '서울 강남구 압구정로 55',
    phone: '+82-2-4444-5555',
    description: 'Dream Plastic Surgery focuses exclusively on upper facial rejuvenation, helping international patients achieve refreshed, naturally youthful appearances through precision procedures targeting the eyes and forehead. Our signature treatments include under-eye fat repositioning for tear trough correction, brow lifting, forehead augmentation with biocompatible implants, and temporal hollowing correction with fat grafting. These procedures are frequently combined in our "Upper Face Refresh Package," which is popular among patients in their 30s and 40s seeking non-dramatic results. All surgeries are performed in our accredited private operating theater. Recovery accommodation in nearby partnered guesthouses can be arranged. Dream offers consultations in English, Chinese, and German and provides detailed digital simulations of expected outcomes during the planning stage.',
    languages: ['English', 'Chinese', 'German'], rating: 4.7, review_count: 423,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },
  {
    id: '15', slug: 'slim-body-clinic', name: 'Slim Body Clinic', name_ko: '슬림바디 클리닉',
    specialty: '성형외과', specialties: ['성형외과', '윤곽주사', '비만치료'],
    district: 'Hongdae', address: '서울 마포구 양화로 23',
    phone: '+82-2-5555-6666',
    description: 'Slim Body Clinic offers a non-surgical approach to body shaping and fat reduction, using Korean-developed injection protocols, ultrasound cavitation, and cryolipolysis to deliver meaningful body changes without anesthesia or recovery time. Our most popular treatment is the "S-Line Injection Program" — a physician-administered mesotherapy course targeting localized fat on the abdomen, flanks, thighs, and arms. We also offer GLP-1 peptide consultation for patients interested in medically supervised weight management. Each patient receives a body composition scan (InBody 970) and customized nutrition targets as part of their treatment. Our clinic caters to European and Latin American visitors and has French- and Italian-speaking coordinators available. Treatment packages range from single sessions to 12-week transformation programs.',
    languages: ['English', 'French', 'Italian'], rating: 4.4, review_count: 178,
    is_verified: false, is_premium: false, image_url: '', price_range: '€€'
  },

  // 치과
  {
    id: '16', slug: 'bright-dental', name: 'Bright Dental Seoul', name_ko: '브라이트 치과',
    specialty: '치과', specialties: ['치과', '임플란트', '치아교정'],
    district: 'Gangnam', address: '서울 강남구 선릉로 30',
    phone: '+82-2-6666-7777',
    description: 'Bright Dental Seoul is a full-service dental clinic in Gangnam widely regarded as one of the best options for international patients seeking implants and orthodontic treatment at a fraction of European or North American prices. Our implantology team has placed over 30,000 implants and offers same-day immediate loading protocols for qualifying patients, reducing total treatment time significantly. Orthodontic options include traditional metal braces, ceramic brackets, and Invisalign Go and Comprehensive systems. Digital treatment planning allows patients to preview tooth movements and final outcomes on screen before beginning. Our international patient coordinator speaks English, Chinese, and Japanese and assists with treatment scheduling, airport pickup referrals, and accommodation. All digital records are transferable to your dentist at home for continuation of care.',
    languages: ['English', 'Chinese', 'Japanese'], rating: 4.8, review_count: 445,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€'
  },
  {
    id: '17', slug: 'seoul-smile', name: 'Seoul Smile Dental', name_ko: '서울스마일 치과',
    specialty: '치과', specialties: ['치과', '라미네이트', '미백'],
    district: 'Myeongdong', address: '서울 중구 명동길 67',
    phone: '+82-2-7777-8888',
    description: 'Seoul Smile Dental is a cosmetic dentistry boutique in Myeongdong specializing in complete smile makeovers using porcelain veneers, e.max crowns, composite bonding, and professional teeth whitening. Our lead cosmetic dentist trained in aesthetic dentistry in the United States and brings an artist\'s eye to every smile design. Using digital smile design software, we create 2D and 3D previews of your transformed smile before touching a single tooth. Veneer procedures can often be completed in two visits over 5–7 days, making Seoul Smile a popular destination for international travelers on a focused dental trip. In-chair and take-home whitening systems are available. Consultations are provided in English, Spanish, and Portuguese, with transparent pricing and itemized treatment quotes provided in writing.',
    languages: ['English', 'Spanish', 'Portuguese'], rating: 4.7, review_count: 334,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },
  {
    id: '18', slug: 'korea-implant-center', name: 'Korea Implant Center', name_ko: '코리아 임플란트센터',
    specialty: '치과', specialties: ['치과', '임플란트', '틀니'],
    district: 'Gangnam', address: '서울 강남구 논현로 112',
    phone: '+82-2-8888-9999',
    description: 'Korea Implant Center is the country\'s highest-volume implant specialist clinic, having completed over 50,000 successful implant placements since 2008 with a documented success rate exceeding 98.5%. We use Osstem, Straumann, and Nobel Biocare systems depending on each patient\'s bone density, jaw anatomy, and aesthetic requirements. All implant procedures are guided by 3D CBCT cone beam CT scanning for precision placement. We offer bone grafting, sinus lift, and All-on-4 full arch reconstruction for complex cases. A 15-year structural warranty is provided on all implant fixtures placed at our clinic. Our international team speaks English, Russian, and Mandarin. Patients traveling from abroad receive a complimentary 3D diagnostic scan on arrival, and emergency dental care is available 365 days a year.',
    languages: ['English', 'Russian', 'Chinese'], rating: 4.9, review_count: 678,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€'
  },
  {
    id: '19', slug: 'white-dental', name: 'White Dental Clinic', name_ko: '화이트 치과',
    specialty: '치과', specialties: ['치과', '잇몸치료', '충치'],
    district: 'Itaewon', address: '서울 용산구 이태원로 44',
    phone: '+82-2-9999-0000',
    description: 'White Dental Clinic in Itaewon is a welcoming general and preventive dentistry practice that has built a loyal following among Seoul\'s expat community and international visitors since 2012. We offer comprehensive oral health check-ups, professional scaling, cavity treatment using tooth-colored composite resin, root canal therapy, and emergency extractions. Our clinic is equipped with digital X-rays that reduce radiation exposure by 80% compared to traditional film. All treatment notes and X-rays are provided digitally in English upon request for transfer to your home dentist. We offer flexible appointment slots including Saturday evening hours. English and French are spoken fluently by our clinical staff, and Arabic interpretation can be arranged with advance notice for our growing community of patients from the Gulf region.',
    languages: ['English', 'French', 'Arabic'], rating: 4.5, review_count: 201,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '20', slug: 'kids-adult-dental', name: 'Kids & Adult Dental', name_ko: '키즈앤어덜트 치과',
    specialty: '치과', specialties: ['치과', '소아치과', '교정'],
    district: 'Sinchon', address: '서울 서대문구 연세로 88',
    phone: '+82-2-1234-9876',
    description: 'Kids & Adult Dental is a family-centered dental practice in Sinchon offering specialized care for children and adults under one roof. Our pediatric team creates a calm, child-friendly environment with games, cartoons, and gentle desensitization techniques to help young patients build positive associations with dental care from an early age. For adults, we offer comprehensive orthodontic services including metal braces, ceramic braces, and clear aligners. We are a certified Invisalign provider and carry full Teen and Comprehensive product lines. Fissure sealants, fluoride applications, and space maintainers are available for children. All our dental hygienists are licensed and trained in pediatric infection control protocols. English and Mandarin-speaking coordinators assist international families. Walk-in consultations for orthodontic cases are available on weekday mornings.',
    languages: ['English', 'Chinese'], rating: 4.6, review_count: 145,
    is_verified: false, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '21', slug: 'aesthetic-dental', name: 'Aesthetic Dental Studio', name_ko: '에스테틱 치과',
    specialty: '치과', specialties: ['치과', '베니어', '크라운'],
    district: 'Cheongdam', address: '서울 강남구 청담로 56',
    phone: '+82-2-5678-1234',
    description: 'Aesthetic Dental Studio in Cheongdam is an exclusive dental atelier serving patients who demand the highest standards of precision, aesthetics, and materials in restorative and cosmetic dentistry. Every porcelain veneer and crown is fabricated in-house by our master ceramist using e.max lithium disilicate and zirconia materials selected for their life-like translucency. We perform full mouth reconstruction for patients with severe wear, bite problems, or multiple missing teeth, using a team approach that may include our in-house periodontist and oral surgeon. Treatment planning involves digital wax-up models and mock-up provisionals so patients can evaluate their new smile before final delivery. All procedures are carried out under loupes magnification and operating microscope where required. Consultations are conducted in English, Japanese, and German.',
    languages: ['English', 'Japanese', 'German'], rating: 4.8, review_count: 267,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€€'
  },

  // 정형외과
  {
    id: '22', slug: 'joint-care-hospital', name: 'Joint Care Hospital', name_ko: '조인트케어 병원',
    specialty: '정형외과', specialties: ['정형외과', '무릎', '관절경'],
    district: 'Gangnam', address: '서울 강남구 영동대로 500',
    phone: '+82-2-2345-8765',
    description: 'Joint Care Hospital is a leading orthopedic center in Seoul specializing in knee and hip joint surgery, recognized internationally for its expertise in minimally invasive arthroscopic procedures and robotic-assisted joint replacement. Our surgical team uses the MAKO robotic arm system for total knee and hip replacements, improving implant alignment accuracy to within 1mm and significantly reducing recovery time. We perform approximately 2,000 joint replacements annually and accept patients from across Asia, the Middle East, and Europe seeking high-quality orthopedic care. Pre-surgical planning includes MRI, CT scanning, and 3D templating to custom-size each implant. Comprehensive physiotherapy and hydrotherapy programs begin on post-op day one. English, Chinese, and Japanese-speaking patient liaisons are available throughout the admission process.',
    languages: ['English', 'Chinese', 'Japanese'], rating: 4.8, review_count: 389,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€€'
  },
  {
    id: '23', slug: 'spine-center-korea', name: 'Spine Center Korea', name_ko: '척추센터 코리아',
    specialty: '정형외과', specialties: ['정형외과', '척추', '디스크'],
    district: 'Gangnam', address: '서울 강남구 테헤란로 450',
    phone: '+82-2-3456-7654',
    description: 'Spine Center Korea is a specialist orthopedic clinic focused exclusively on conditions of the cervical, thoracic, and lumbar spine. Our spine surgeons are among Korea\'s most experienced, with expertise in lumbar microdiscectomy, cervical ACDF, spinal fusion, and percutaneous endoscopic discectomy — a minimally invasive technique that leaves incisions of less than 8mm and allows same-day or next-day discharge. We treat herniated discs, spinal stenosis, scoliosis, and degenerative disc disease in patients who have not found relief through conservative management. Non-surgical options including epidural injections, nerve blocks, and physiotherapy are also available. We serve a large patient base from Vietnam and Indonesia and offer language support in Vietnamese and Bahasa Indonesia. Medical reports and imaging are provided in English for use by patients\' home physicians.',
    languages: ['English', 'Vietnamese', 'Indonesian'], rating: 4.7, review_count: 234,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },
  {
    id: '24', slug: 'sport-medicine-clinic', name: 'Sport Medicine Clinic', name_ko: '스포츠의학 클리닉',
    specialty: '정형외과', specialties: ['정형외과', '스포츠손상', '인대'],
    district: 'Hongdae', address: '서울 마포구 와우산로 34',
    phone: '+82-2-4567-6543',
    description: 'Sport Medicine Clinic is Seoul\'s premier destination for competitive athletes and active individuals seeking expert diagnosis and treatment of sports-related musculoskeletal injuries. Our team includes former team physicians for Korean national sports federations, bringing elite-level expertise to every patient. We treat ACL, PCL, and rotator cuff tears, meniscal injuries, ankle instability, and stress fractures using a combination of surgical and regenerative approaches. PRP and stem cell therapy are available as adjuncts to accelerate tissue healing. Our sports physiotherapy team designs individualized return-to-sport protocols, and sports performance testing is available post-rehabilitation. We treat athletes from professional, amateur, and recreational backgrounds equally. English, French, and Spanish consultations are available, and telemedicine follow-up is provided for athletes returning home post-treatment.',
    languages: ['English', 'French', 'Spanish'], rating: 4.6, review_count: 167,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },
  {
    id: '25', slug: 'bone-health-center', name: 'Bone Health Center', name_ko: '뼈건강 센터',
    specialty: '정형외과', specialties: ['정형외과', '골절', '골다공증'],
    district: 'Sinchon', address: '서울 서대문구 이화여대길 12',
    phone: '+82-2-5678-5432',
    description: 'Bone Health Center specializes in the assessment and management of metabolic bone disease, fracture care, and osteoporosis in patients of all ages. Our clinicians use DEXA bone density scanning, laboratory calcium and vitamin D panels, and vertebral fracture assessment to establish a complete picture of skeletal health. For patients with osteoporosis, we provide medication management including bisphosphonates, denosumab, and anabolic agents, and work with international patients to establish long-term treatment plans they can continue at home. Acute fracture care is also available, with our orthopedic surgeon specializing in minimally invasive fixation of wrist, hip, and vertebral compression fractures. English and Russian consultations are available. This clinic is particularly well-suited for post-menopausal women traveling with a family member for medical assessment.',
    languages: ['English', 'Russian'], rating: 4.4, review_count: 98,
    is_verified: false, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '26', slug: 'hand-shoulder-clinic', name: 'Hand & Shoulder Clinic', name_ko: '수부어깨 클리닉',
    specialty: '정형외과', specialties: ['정형외과', '어깨', '손목'],
    district: 'Itaewon', address: '서울 용산구 한남대로 78',
    phone: '+82-2-6789-4321',
    description: 'Hand & Shoulder Clinic is a sub-specialist orthopedic clinic offering dedicated care for conditions of the shoulder, elbow, wrist, and hand. Our surgeon completed a fellowship in upper limb surgery at a UK teaching hospital and has extensive experience treating rotator cuff tears, shoulder impingement, frozen shoulder, SLAP lesions, carpal tunnel syndrome, trigger finger, and Dupuytren\'s contracture. Both conservative and surgical treatment pathways are offered, and nerve conduction studies can be performed in-clinic for patients with suspected carpal tunnel or cubital tunnel syndrome. Arthroscopic shoulder surgery is performed as a day case. We have significant experience with patients from the Middle East and Persian Gulf and offer Arabic and Farsi interpretation. Telehealth consultations for international patients are available before travel and for post-operative follow-up.',
    languages: ['English', 'Arabic', 'Persian'], rating: 4.5, review_count: 145,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€€'
  },

  // 내과
  {
    id: '27', slug: 'seoul-internal-medicine', name: 'Seoul Internal Medicine', name_ko: '서울 내과',
    specialty: '내과', specialties: ['내과', '건강검진', '당뇨'],
    district: 'Myeongdong', address: '서울 중구 을지로 123',
    phone: '+82-2-7890-3210',
    description: 'Seoul Internal Medicine is a comprehensive health screening and chronic disease management clinic located in the center of Seoul, offering same-day results for all major health panels. Our executive health checkup program includes full blood count, metabolic panel, thyroid function, tumor markers, abdominal and pelvic ultrasound, chest X-ray, EKG, pulmonary function test, and colorectal cancer screening — all completed within a half-day visit. Specialist consultations in endocrinology, gastroenterology, and cardiology are available on the same day if abnormalities are identified. Reports are issued in English, Korean, Chinese, and Japanese. We have a particular strength in managing type 2 diabetes and metabolic syndrome for international patients, including remote monitoring and medication adjustment via our telehealth platform. Over 3,000 corporate executives use our annual screening program.',
    languages: ['English', 'Chinese', 'Japanese', 'Spanish'], rating: 4.7, review_count: 456,
    is_verified: true, is_premium: true, image_url: '', price_range: '€€€'
  },
  {
    id: '28', slug: 'global-health-clinic', name: 'Global Health Clinic', name_ko: '글로벌 헬스 클리닉',
    specialty: '내과', specialties: ['내과', '고혈압', '심장'],
    district: 'Gangnam', address: '서울 강남구 삼성로 90',
    phone: '+82-2-8901-2109',
    description: 'Global Health Clinic is an internationally oriented internal medicine practice in Gangnam, specializing in cardiovascular disease prevention, hypertension management, and metabolic disorders in an expat and medical tourism population. Our internist, trained in Germany and Korea, brings a European evidence-based approach to care, prioritizing lifestyle medicine alongside pharmaceutical treatment. We offer 24-hour blood pressure monitoring (ABPM), echocardiography, stress testing, and coronary calcium scoring CT for cardiovascular risk stratification. All medications prescribed can be provided with English-language information leaflets. We maintain strong networks with cardiologists, endocrinologists, and pulmonologists for urgent referrals. Consultations are conducted in English, French, and German. Telehealth follow-up is standard for international patients managing chronic conditions between visits.',
    languages: ['English', 'French', 'German', 'Arabic'], rating: 4.6, review_count: 234,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '29', slug: 'digestive-center', name: 'Digestive Health Center', name_ko: '소화기 건강센터',
    specialty: '내과', specialties: ['내과', '위내시경', '대장내시경'],
    district: 'Sinchon', address: '서울 서대문구 신촌로 200',
    phone: '+82-2-9012-1098',
    description: 'Digestive Health Center provides gold-standard gastrointestinal endoscopy and hepatology services to a large international patient population in Seoul. We perform upper GI endoscopy and colonoscopy under sedation, with most procedures completed in under 30 minutes and recovery taking approximately one hour. Our endoscopy unit uses the latest Olympus EVIS X1 imaging platform, which provides AI-assisted polyp detection for colonoscopy — shown to increase adenoma detection rates by up to 20%. Patients receive a detailed written report with annotated photographs in English on the day of the procedure. We also provide hepatitis B and C screening, treatment monitoring, and liver ultrasound. Chinese-speaking staff are available daily, and Russian interpretation is available by appointment. Bowel preparation instructions and dietary guidance are provided in your preferred language in advance.',
    languages: ['English', 'Chinese', 'Russian'], rating: 4.5, review_count: 178,
    is_verified: true, is_premium: false, image_url: '', price_range: '€€'
  },
  {
    id: '30', slug: 'vitality-medical', name: 'Vitality Medical Center', name_ko: '바이탈리티 의료센터',
    specialty: '내과', specialties: ['내과', '갑상선', '호르몬'],
    district: 'Gangnam', address: '서울 강남구 봉은사로 67',
    phone: '+82-2-0123-0987',
    description: 'Vitality Medical Center is a specialist endocrinology and hormonal health clinic in Gangnam offering comprehensive assessment and treatment for thyroid disease, adrenal disorders, reproductive hormone imbalances, and age-related hormonal decline. We perform in-clinic thyroid ultrasound and fine needle aspiration biopsy for thyroid nodules, with cytology results available within 48 hours. For patients with hypothyroidism or hyperthyroidism, we optimize dosing using advanced free hormone and antibody panels rather than relying on TSH alone. Our integrative hormone team also provides male and female hormone optimization programs grounded in evidence-based medicine. English and Japanese-speaking clinicians are on staff, and Indonesian-language coordination is available for our Southeast Asian patients. We provide comprehensive written reports with treatment recommendations suitable for sharing with your home endocrinologist.',
    languages: ['English', 'Japanese', 'Indonesian'], rating: 4.6, review_count: 134,
    is_verified: false, is_premium: false, image_url: '', price_range: '€€€'
  },
]
