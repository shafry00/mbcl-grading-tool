import React, { useState, useEffect } from 'react';

const PREP_KEY = 'mbcl-student-prep-v1';

const PLATFORMS = [
  { id: 'claude', label: 'Claude', icon: '🤖' },
  { id: 'github', label: 'GitHub', icon: '🐙' },
  { id: 'vercel', label: 'Vercel', icon: '▲' },
  { id: 'replit', label: 'Replit', icon: '🔁' },
];

const GROUPS = [
  {
    id: 1, ta: 'Muhammad Irfan Mursyidin',
    students: [
      { id: 'g1_0', name: 'Ivan Prasodjo', nick: 'Ivan' },
      { id: 'g1_1', name: 'Tubagus Kaisar Wijaya', nick: 'Bagus' },
      { id: 'g1_2', name: 'Ella Amalia', nick: 'Ella' },
      { id: 'g1_3', name: 'Fitri', nick: 'Menok' },
      { id: 'g1_4', name: 'Himawan Adi Prakosa', nick: 'Hima' },
      { id: 'g1_5', name: 'Fadhilah Achmad Ardiansyah', nick: 'Fadhil' },
      { id: 'g1_6', name: 'David Ronald Jacob', nick: 'Dave' },
      { id: 'g1_7', name: 'Ulima Sahda', nick: 'Ahda' },
      { id: 'g1_8', name: 'Ayu Indirawanty', nick: 'Ayu' },
      { id: 'g1_9', name: 'Ibal', nick: 'Ibal' },
      { id: 'g1_10', name: 'Anry S Pangloli', nick: 'Anry' },
      { id: 'g1_11', name: 'Vina Kirana', nick: 'Vina' },
      { id: 'g1_12', name: 'Igo Novaldi Sandri', nick: 'Igo' },
      { id: 'g1_13', name: 'Ardhilo Putra Wibowo', nick: 'Dhilo' },
      { id: 'g1_14', name: 'Victor Tampi', nick: 'Victor' },
      { id: 'g1_15', name: 'Oktarina Dwi Fajarningsih', nick: 'Okta' },
      { id: 'g1_16', name: 'Amalia Nur Rachmah', nick: 'Rachmah' },
      { id: 'g1_17', name: 'Hestyriani Anisa', nick: 'Nisa' },
      { id: 'g1_18', name: 'Pesona Agrata', nick: 'Agra' },
      { id: 'g1_19', name: 'Randy Natanael', nick: 'Randy' },
      { id: 'g1_20', name: 'Yudha Kurniawan', nick: 'Yudha' },
      { id: 'g1_21', name: 'Nashita Althafunnisa', nick: 'Nashita' },
      { id: 'g1_22', name: 'Hanifah Fathia Nuzla Ramadini', nick: 'Hani' },
      { id: 'g1_23', name: 'Suhung', nick: 'Suhung' },
      { id: 'g1_24', name: 'Azwar Amiruddin', nick: 'Azwar' },
      { id: 'g1_25', name: 'Hadiana', nick: 'Had' },
    ],
  },
  {
    id: 2, ta: 'Siti Aisyah Adri',
    students: [
      { id: 'g2_0', name: 'Rivai', nick: 'Rivai' },
      { id: 'g2_1', name: 'Dikky Yulianto', nick: 'Dikky' },
      { id: 'g2_2', name: 'Cindy', nick: 'Cindy' },
      { id: 'g2_3', name: 'Helda Khusun', nick: 'Helda' },
      { id: 'g2_4', name: 'Chairunnisa', nick: 'Cai' },
      { id: 'g2_5', name: 'Novika Amanah Eka Sakti', nick: 'Vika' },
      { id: 'g2_6', name: 'Rafdi', nick: 'Rafdi' },
      { id: 'g2_7', name: 'Ridwan Fuady Martanegara', nick: 'Ridwan' },
      { id: 'g2_8', name: 'Lidiya', nick: 'Lidya' },
      { id: 'g2_9', name: 'Jeremy Nathaniel Gunawan', nick: 'Jerry' },
      { id: 'g2_10', name: 'Wina Yuwina', nick: 'Wina' },
      { id: 'g2_11', name: 'Egi Putra Setiawan', nick: 'Egi' },
      { id: 'g2_12', name: 'William', nick: 'William' },
      { id: 'g2_13', name: 'Dadi Daruslan', nick: 'Dadi' },
      { id: 'g2_14', name: 'Saleh Purnomo', nick: 'Saleh' },
      { id: 'g2_15', name: 'Iqbal Adham', nick: 'Iqbal' },
      { id: 'g2_16', name: 'Mirza Khairul Azwar', nick: 'Mirza' },
      { id: 'g2_17', name: 'Yusmin', nick: 'Andi' },
      { id: 'g2_18', name: 'Jimmy Jaya Nugraha', nick: 'Jimmy' },
      { id: 'g2_19', name: 'Roberto Alexander', nick: 'Robert' },
      { id: 'g2_20', name: 'Adinda Suci Rahayu', nick: 'Dinda' },
      { id: 'g2_21', name: 'Aidatul Fitriyyah Sulaiman', nick: 'Aida' },
      { id: 'g2_22', name: 'Imelynia Pratiwi Suhari', nick: 'Imel' },
      { id: 'g2_23', name: 'Monica Adelia', nick: 'Monic' },
      { id: 'g2_24', name: 'Aditya Permadi', nick: 'Adit' },
      { id: 'g2_25', name: 'Daniel Gelegar Pamungkas', nick: 'Enggar' },
    ],
  },
  {
    id: 3, ta: 'Andisa Rizky Febrianti',
    students: [
      { id: 'g3_0', name: 'Aini Azizati', nick: 'Aini' },
      { id: 'g3_1', name: 'Faiz Muhammad Alfatih', nick: 'Faiz' },
      { id: 'g3_2', name: 'Anggit Akbar Yudisaputra', nick: 'Anggit' },
      { id: 'g3_3', name: 'Muhammad Fakhri Febriawan', nick: 'Fakhri' },
      { id: 'g3_4', name: 'Didin Pathudin', nick: 'Didin' },
      { id: 'g3_5', name: 'Chakimatuzzahroh', nick: 'Chaki' },
      { id: 'g3_6', name: 'Muhammad Nizar, S.T.', nick: 'Nizar' },
      { id: 'g3_7', name: 'Ganang Rizky Nugraha', nick: 'Ganang' },
      { id: 'g3_8', name: 'Ikhwanul Kurnia Rahman', nick: 'Ikhwan' },
      { id: 'g3_9', name: 'Penni Cahyani', nick: 'Penni' },
      { id: 'g3_10', name: 'Theresia Palupi Utami', nick: 'Tere' },
      { id: 'g3_11', name: 'Ricky', nick: 'Ricky' },
      { id: 'g3_12', name: 'Nabila Martagati', nick: 'Nabila' },
      { id: 'g3_13', name: 'Aisa Putri Sekartaji', nick: 'Aisa' },
      { id: 'g3_14', name: 'Ni Made Ayu Parwati', nick: 'De Ayu' },
      { id: 'g3_15', name: 'Annisa Jumaniar', nick: 'Annisa' },
      { id: 'g3_16', name: 'Ahmad Furqon Kusuma Yudha', nick: 'Ucon' },
      { id: 'g3_17', name: 'Sita Puspitaningtyas', nick: 'Sita' },
      { id: 'g3_18', name: 'Doni Berni Pritama', nick: 'Doni' },
      { id: 'g3_19', name: 'Steven Dhalimarta', nick: 'Steven' },
      { id: 'g3_20', name: 'Akbar Malik Adi Nugraha', nick: 'Akbar' },
      { id: 'g3_21', name: 'Muhammad Azka Arkananta', nick: 'Azka' },
      { id: 'g3_22', name: 'Arief Wicaksana', nick: 'Wicak' },
      { id: 'g3_23', name: 'Agustina Puspa Anggraeni', nick: 'Anggi' },
      { id: 'g3_24', name: 'Bianca Zain', nick: 'Bianca' },
    ],
  },
  {
    id: 4, ta: 'Hamzah Arman Husni',
    students: [
      { id: 'g4_0', name: 'Rico Priandana Loris', nick: 'Rico' },
      { id: 'g4_1', name: 'Mahardika Firjatullah', nick: 'Hardi' },
      { id: 'g4_2', name: 'Mirwan Alkhatiri', nick: 'Mirwan' },
      { id: 'g4_3', name: 'Muhammad Rinaldi', nick: 'Rinaldi' },
      { id: 'g4_4', name: 'Nela Sumiati', nick: 'Ney' },
      { id: 'g4_5', name: 'Muhamad Yusnen', nick: 'Yusnen' },
      { id: 'g4_6', name: 'Magfiratul Istiqamah', nick: 'Magfira' },
      { id: 'g4_7', name: 'Wahyu Lisdianingrum', nick: 'Lisdia' },
      { id: 'g4_8', name: 'Ulil Amri', nick: 'Amri' },
      { id: 'g4_9', name: 'Yogi Permana', nick: 'Yogi' },
      { id: 'g4_10', name: 'Harry Budi Santoso', nick: 'Harry' },
      { id: 'g4_11', name: 'Benny', nick: 'Benny' },
      { id: 'g4_12', name: 'Fina', nick: 'Fina' },
      { id: 'g4_13', name: 'Manggara Triantoro', nick: 'Manggara' },
      { id: 'g4_14', name: 'Indriani Widya Utari', nick: 'Indriwu' },
      { id: 'g4_15', name: 'Willy Herwanto', nick: 'Willy' },
      { id: 'g4_16', name: 'Ivone', nick: 'Ivone' },
      { id: 'g4_17', name: 'Sahat Panggabean', nick: 'Sahat' },
      { id: 'g4_18', name: 'Annisa Sajidah', nick: 'Annisa' },
      { id: 'g4_19', name: 'Ignatius Allie Maynard', nick: 'Maynard' },
      { id: 'g4_20', name: 'Febryan', nick: 'Febryan' },
      { id: 'g4_21', name: 'Farrellio Winston Cahyadi', nick: 'Farrel' },
      { id: 'g4_22', name: 'Mochammad Taufan', nick: 'Taufan' },
      { id: 'g4_23', name: 'Munazyi', nick: 'Aji' },
      { id: 'g4_24', name: 'Novas Agita', nick: 'Novas' },
    ],
  },
  {
    id: 5, ta: 'Rizky Anandasigit Nugraha',
    students: [
      { id: 'g5_0', name: 'Muhammad Zahra', nick: 'Zahra' },
      { id: 'g5_1', name: 'Sylvanus Gani Mendrofa', nick: 'Gani' },
      { id: 'g5_2', name: 'Febi Mutiara', nick: 'Febi' },
      { id: 'g5_3', name: 'Muhammad Reza', nick: 'Reza' },
      { id: 'g5_4', name: 'Hans Ariel Satyana', nick: 'Hans' },
      { id: 'g5_5', name: 'Yudha Farizky Ramanda', nick: 'Yudha' },
      { id: 'g5_6', name: 'Girang Setyo Marinda', nick: 'Girang' },
      { id: 'g5_7', name: 'Novita Caecilia', nick: 'Novita' },
      { id: 'g5_8', name: 'Dennis Oswald', nick: 'Dennis' },
      { id: 'g5_9', name: 'Muhtar Fauzy', nick: 'Mumu' },
      { id: 'g5_10', name: 'Muhammad Ikhsan', nick: 'Ikhsan' },
      { id: 'g5_11', name: 'Tri Indriyani', nick: 'Indri' },
      { id: 'g5_12', name: 'Antonius Adi Prasetya', nick: 'Pras' },
      { id: 'g5_13', name: 'Muhammad Ramadhan', nick: 'Rama' },
      { id: 'g5_14', name: 'Nisa Arifiani Fazia', nick: 'Nisaa' },
      { id: 'g5_15', name: 'Edison Parulian Manik', nick: 'Edi' },
      { id: 'g5_16', name: 'Andika Rahmawati', nick: 'Akid' },
      { id: 'g5_17', name: 'Rafifatul Amirah', nick: 'Rafifatul' },
      { id: 'g5_18', name: 'Olga Sri Fuluna', nick: 'Olga' },
      { id: 'g5_19', name: 'Diena Maysya Zyandra', nick: 'May' },
      { id: 'g5_20', name: 'Otaviani Priesta', nick: 'Pris' },
      { id: 'g5_21', name: 'Adhinta Najza', nick: 'Adhinta' },
      { id: 'g5_22', name: "Habib Ma'Rif", nick: 'Habib' },
      { id: 'g5_23', name: 'Heri Satriawan', nick: 'Heri' },
      { id: 'g5_24', name: 'Emiral Rizwan Santoso', nick: 'Rizwan' },
    ],
  },
  {
    id: 6, ta: 'Salwa Shabrina',
    students: [
      { id: 'g6_0', name: 'Yohanes Bosco Ranndi Pusponegoro', nick: 'Bosco' },
      { id: 'g6_1', name: 'Muhammad Irwan', nick: 'Irwan' },
      { id: 'g6_2', name: 'Galuh Pramudipto', nick: 'Galuh' },
      { id: 'g6_3', name: 'Erwinsyah Maulana', nick: 'Erwin' },
      { id: 'g6_4', name: 'Dadang Suhirman', nick: 'Dadang' },
      { id: 'g6_5', name: 'Fadel Basrianto', nick: 'Fadel' },
      { id: 'g6_6', name: 'Agus Aditya Pramana', nick: 'Agus' },
      { id: 'g6_7', name: 'Revy Alfriza', nick: 'Revy' },
      { id: 'g6_8', name: 'Alif Machroji', nick: 'Alif' },
      { id: 'g6_9', name: 'Robby Suliantoro', nick: 'Robby' },
      { id: 'g6_10', name: 'Eliezer Kennard Adna Santoso', nick: 'Kennard' },
      { id: 'g6_11', name: 'Zulham', nick: 'Zulham' },
      { id: 'g6_12', name: 'Handoko Lie', nick: 'Handoko' },
      { id: 'g6_13', name: 'Ferry', nick: 'Ferry' },
      { id: 'g6_14', name: 'Selma Asiela Badzlin', nick: 'Selma' },
      { id: 'g6_15', name: 'Sony Hardyanto Tjandra', nick: 'Sony' },
      { id: 'g6_16', name: 'Austin Perdamean', nick: 'Austin' },
      { id: 'g6_17', name: 'Uyun Machsunah', nick: 'Uyun' },
      { id: 'g6_18', name: 'Achmad Khadafi Munir', nick: 'Dafi' },
      { id: 'g6_19', name: 'Henry Tejakusmana', nick: 'Henry' },
      { id: 'g6_20', name: 'Yenny Yudiyanty', nick: 'Yenny' },
      { id: 'g6_21', name: 'Tang Tarunodjojo', nick: 'Robert' },
      { id: 'g6_22', name: 'Dedy Ristanto', nick: 'Dedy' },
      { id: 'g6_23', name: 'Qaidi Azham Anwar S', nick: 'Chairul' },
      { id: 'g6_24', name: 'Muhammad Rafi Adzany', nick: 'Rafi' },
    ],
  },
  {
    id: 7, ta: 'Fadil Muhammad Putra',
    students: [
      { id: 'g7_0', name: 'Diah Sm', nick: 'Sally' },
      { id: 'g7_1', name: 'Putri Amalia Sholichah', nick: 'Putri' },
      { id: 'g7_2', name: 'Tania', nick: 'Tania' },
      { id: 'g7_3', name: 'Wisnu Sakti Dewobroto', nick: 'Wisnu' },
      { id: 'g7_4', name: 'Citra Astari', nick: 'Citra' },
      { id: 'g7_5', name: 'Hariyanto', nick: 'Hari' },
      { id: 'g7_6', name: 'Rudi Sigar', nick: 'Rudi' },
      { id: 'g7_7', name: 'Arief Kurniawan', nick: 'Arief' },
      { id: 'g7_8', name: 'Runiar Satriya', nick: 'Runi' },
      { id: 'g7_9', name: 'Arie Andira Ferdiana', nick: 'Arie' },
      { id: 'g7_10', name: 'Hasanuddin', nick: 'Hasanuddin' },
      { id: 'g7_11', name: 'Dr. Jusman, S.Kel, M.Si', nick: 'Jusman' },
      { id: 'g7_12', name: 'Rahmat Alfiansyah Nasution', nick: 'Iyan' },
      { id: 'g7_13', name: 'Amelia Ruby Hagieswari', nick: 'Amel' },
      { id: 'g7_14', name: 'Aldy Rifianto', nick: 'Aldy' },
      { id: 'g7_15', name: 'Etsa Felela', nick: 'Ettsa' },
      { id: 'g7_16', name: 'Satria Manbanta Tarigan Sibero', nick: 'Satria' },
      { id: 'g7_17', name: 'Eric Leonard', nick: 'Eric' },
      { id: 'g7_18', name: 'Mohamad Arif Mujaki', nick: 'Jaki' },
      { id: 'g7_19', name: 'Michella Ham', nick: 'Ella' },
      { id: 'g7_20', name: 'Dony Septyharsono', nick: 'Dony' },
      { id: 'g7_21', name: 'Frezy Susanto', nick: 'Ezy' },
      { id: 'g7_22', name: 'Audia Kusuma', nick: 'Audi' },
      { id: 'g7_23', name: 'Lilik Jamroni', nick: 'Lilik' },
      { id: 'g7_24', name: 'Muhadi Murtadho', nick: 'Hadi' },
      { id: 'g7_25', name: 'Reza Nur Hidayat', nick: 'Reza' },
    ],
  },
  {
    id: 8, ta: 'Rizky Phyar Saiputra',
    students: [
      { id: 'g8_0', name: 'Devi Purnamasari', nick: 'Devi' },
      { id: 'g8_1', name: 'Febryanthie Sheila Marie Apituley', nick: 'Feby' },
      { id: 'g8_2', name: 'Ilham Akbar Ghifari', nick: 'Ilham' },
      { id: 'g8_3', name: 'Tiara Nur Rizka Karlinda', nick: 'Tiara' },
      { id: 'g8_4', name: 'Asyida Hayati Shofa', nick: 'Asyida' },
      { id: 'g8_5', name: 'Yemima Amanda Ayu P', nick: 'Mima' },
      { id: 'g8_6', name: 'Ilzam Sabila Ahmad Ghulba', nick: 'Ilzam' },
      { id: 'g8_7', name: 'Muhammad Alif Hidayat', nick: 'Alif' },
      { id: 'g8_8', name: 'Rizal Diansyah', nick: 'Rizal' },
      { id: 'g8_9', name: 'Amanda Rahmalia Syafitri', nick: 'Endah' },
      { id: 'g8_10', name: 'Ira Samri', nick: 'Ira' },
      { id: 'g8_11', name: 'Sisca', nick: 'Sisca' },
      { id: 'g8_12', name: 'Andini Nurul Prasetyani', nick: 'Andin' },
      { id: 'g8_13', name: 'Tri Astuti', nick: 'Tuti' },
      { id: 'g8_14', name: 'Faathir Al Kasa', nick: 'Faathir' },
      { id: 'g8_15', name: 'Jusup Gunawan', nick: 'Jusuf' },
      { id: 'g8_16', name: 'Darmawan', nick: 'D' },
      { id: 'g8_17', name: 'Khofifah Nur Hidayah', nick: 'Fifah' },
      { id: 'g8_18', name: 'Hafidh Af', nick: 'Hafidh' },
      { id: 'g8_19', name: 'Alief Hermawan', nick: 'Alief' },
      { id: 'g8_20', name: 'Maria Yosefina Meinadia Sekar Kinanti', nick: 'Meinadia' },
      { id: 'g8_21', name: 'Maureen', nick: 'Maureen' },
      { id: 'g8_22', name: 'Wisnu Hendra Pratama', nick: 'Wisnu H' },
      { id: 'g8_23', name: 'Dhanang Syarief Nur Rochman', nick: 'Dhanang' },
      { id: 'g8_24', name: 'Peni Rizki Yani', nick: 'Peni' },
    ],
  },
  {
    id: 9, ta: 'Witri Permatasari',
    students: [
      { id: 'g9_0', name: 'Muhammad Fawwaz Mahdi', nick: 'Fawwaz' },
      { id: 'g9_1', name: 'Muhamad Fakhrurrozi', nick: 'Rozi' },
      { id: 'g9_2', name: 'Chrisdoris Tan', nick: 'Riris' },
      { id: 'g9_3', name: 'Edwin Chandra Sendjaja', nick: 'Edwin' },
      { id: 'g9_4', name: 'Chyntia Agni Archiyesa', nick: 'Chyntia' },
      { id: 'g9_5', name: 'Fakhri', nick: 'Fahri' },
      { id: 'g9_6', name: 'Adinda Pryanka', nick: 'Adinda' },
      { id: 'g9_7', name: 'Maya Pitaloka', nick: 'Maya' },
      { id: 'g9_8', name: 'Harfiyanti Falinda', nick: 'Falinda' },
      { id: 'g9_9', name: 'Misbakh', nick: 'Misbakh' },
      { id: 'g9_10', name: 'Rino Damar Jati', nick: 'Rino' },
      { id: 'g9_11', name: 'Herliena Dyah Indriani', nick: 'Herliena' },
      { id: 'g9_12', name: 'Juwita Wardah', nick: 'Juwita' },
      { id: 'g9_13', name: 'Latifa Fatkhiyah', nick: 'Latifa' },
      { id: 'g9_14', name: 'David Wibowo', nick: 'David' },
      { id: 'g9_15', name: 'Alifia Nur Faiza', nick: 'Fia' },
      { id: 'g9_16', name: 'Eko Saputro', nick: 'Eko' },
      { id: 'g9_17', name: 'Khodiejah Huwriyyatuljannah', nick: 'Odi' },
      { id: 'g9_18', name: 'Imran Maulana', nick: 'Imran' },
      { id: 'g9_19', name: 'Imam Azhar', nick: 'Azhar' },
      { id: 'g9_20', name: 'Rejina Wijayanti', nick: 'Rejina' },
      { id: 'g9_21', name: 'Alana', nick: 'Alana' },
      { id: 'g9_22', name: 'Febriya Antensari', nick: 'Febi' },
      { id: 'g9_23', name: 'M. Abby Primananda', nick: 'Abby' },
    ],
  },
];

function loadPrep() {
  try { return JSON.parse(localStorage.getItem(PREP_KEY)) || {}; }
  catch { return {}; }
}

function groupProgress(group, checks) {
  const total = group.students.length * PLATFORMS.length;
  const done = group.students.reduce((sum, s) =>
    sum + PLATFORMS.filter((p) => checks[s.id]?.[p.id]).length, 0);
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function studentDone(studentId, checks) {
  return PLATFORMS.filter((p) => checks[studentId]?.[p.id]).length;
}

export default function StudentPrep() {
  const [activeGroup, setActiveGroup] = useState(1);
  const [checks, setChecks] = useState(loadPrep);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(PREP_KEY, JSON.stringify(checks));
  }, [checks]);

  function toggle(studentId, platformId) {
    setChecks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [platformId]: !prev[studentId]?.[platformId],
      },
    }));
  }

  function checkAll(group) {
    const next = { ...checks };
    group.students.forEach((s) => {
      next[s.id] = {};
      PLATFORMS.forEach((p) => { next[s.id][p.id] = true; });
    });
    setChecks(next);
  }

  function uncheckAll(group) {
    const next = { ...checks };
    group.students.forEach((s) => { next[s.id] = {}; });
    setChecks(next);
  }

  const totalStudents = GROUPS.reduce((s, g) => s + g.students.length, 0);
  const totalChecks = GROUPS.reduce((s, g) => s + groupProgress(g, checks).done, 0);
  const totalPossible = totalStudents * PLATFORMS.length;
  const overallPct = Math.round((totalChecks / totalPossible) * 100);

  const currentGroup = GROUPS.find((g) => g.id === activeGroup);
  const prog = groupProgress(currentGroup, checks);

  const filteredStudents = search.trim()
    ? currentGroup.students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.nick.toLowerCase().includes(search.toLowerCase())
      )
    : currentGroup.students;

  return (
    <div className="space-y-4">
      {/* Header + overall */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Student Preparation</h2>
            <p className="text-xs text-gray-500 mt-0.5">Ceklis akun per student — Claude · GitHub · Vercel · Canva</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-bl-blue">{overallPct}%</div>
            <div className="text-xs text-gray-400">{totalChecks}/{totalPossible} checks</div>
          </div>
        </div>
        {/* Overall progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-bl-blue rounded-full transition-all duration-300"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        {/* Per-group mini progress */}
        <div className="grid grid-cols-9 gap-1 mt-3">
          {GROUPS.map((g) => {
            const { pct } = groupProgress(g, checks);
            const color = pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-bl-blue' : 'bg-gray-200';
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={`rounded-lg p-1.5 text-center transition-all ${
                  activeGroup === g.id ? 'ring-2 ring-bl-blue ring-offset-1' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`h-1.5 rounded-full mb-1 ${color}`} />
                <div className="text-xs font-bold text-gray-600">G{g.id}</div>
                <div className="text-[10px] text-gray-400">{pct}%</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Group panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {/* Group header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-black text-gray-900">Kelompok {currentGroup.id}</div>
            <div className="text-xs text-gray-400 mt-0.5">TA: {currentGroup.ta}</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-sm font-bold text-bl-blue">{prog.done}/{prog.total}</div>
            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-bl-blue rounded-full transition-all"
                style={{ width: `${prog.pct}%` }}
              />
            </div>
            <button
              onClick={() => checkAll(currentGroup)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              ✓ Semua
            </button>
            <button
              onClick={() => uncheckAll(currentGroup)}
              className="text-xs font-bold text-gray-400 hover:text-bl-red px-2 py-1 rounded-lg hover:bg-bl-red-light transition-colors"
            >
              × Reset
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pt-3 pb-2">
          <input
            type="text"
            placeholder="Cari nama student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bl-blue focus:border-transparent"
          />
        </div>

        {/* Platform legend + count */}
        <div className="px-5 pt-2 pb-2">
          <div className="flex gap-3 flex-wrap">
            {PLATFORMS.map((p) => {
              const total = currentGroup.students.length;
              const done = currentGroup.students.filter((s) => checks[s.id]?.[p.id]).length;
              return (
                <div key={p.id} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1">
                  <span className="text-xs font-semibold text-gray-600">{p.label}</span>
                  <span className="text-xs font-bold text-bl-blue">{done}/{total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table header */}
        <div className="px-5 py-2 border-t border-gray-50">
          <div className="grid grid-cols-[1fr_repeat(4,44px)] gap-2 items-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Student</div>
            {PLATFORMS.map((p) => (
              <div key={p.id} className="text-center text-xs font-bold text-gray-500">
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Student rows */}
        <div className="divide-y divide-gray-50 px-5 pb-4">
          {filteredStudents.map((student) => {
            const done = studentDone(student.id, checks);
            const allDone = done === PLATFORMS.length;
            return (
              <div
                key={student.id}
                className={`grid grid-cols-[1fr_repeat(4,44px)] gap-2 items-center py-2.5 rounded-xl transition-colors ${
                  allDone ? 'opacity-60' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate ${allDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {student.nick}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{student.name}</div>
                </div>
                {PLATFORMS.map((p) => {
                  const checked = !!checks[student.id]?.[p.id];
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(student.id, p.id)}
                      title={p.label}
                      className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg transition-all text-base ${
                        checked
                          ? 'bg-emerald-100 text-emerald-600 shadow-sm'
                          : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {checked ? '✓' : '·'}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400">Tidak ada student ditemukan</div>
          )}
        </div>

      </div>
    </div>
  );
}
