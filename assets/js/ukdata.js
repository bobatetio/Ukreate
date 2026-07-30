/* Ukreate preview data. One fictional world, shared by every screen so the
   numbers agree with each other. Swap this file for the API later. */
window.UK = (function () {

  var STAGES = ['Applied', 'Offer sent', 'Dates agreed', 'Brief sent', 'Stay booked', 'Content submitted', 'In review', 'Complete'];

  var creators = [
    { id:'c1',  n:'Amara Mensah',    h:'@amaratravels',    loc:'Lisbon, Portugal',   f:128000, p:['ig','tt'],      niche:'Luxury & Lifestyle',  rate:0,    turn:'7 days',  rating:4.9, jobs:23, bio:'Slow travel and design hotels. Shoots everything herself on a Sony FX3.' },
    { id:'c2',  n:'Kelvis Carter',   h:'@kelvisc',         loc:'Miami, USA',         f:86400,  p:['tt','yt'],      niche:'Hotel & Resort UGC',  rate:450,  turn:'5 days',  rating:4.7, jobs:41, bio:'High volume UGC. Fast turnaround, raw files always included.' },
    { id:'c3',  n:'Cesar Delgado',   h:'@cesargoes',       loc:'Mexico City, Mexico',f:54200,  p:['ig'],           niche:'Food & Beverage',     rate:0,    turn:'10 days', rating:4.8, jobs:17, bio:'Restaurant and bar content for resorts. Former line cook.' },
    { id:'c4',  n:'Brooklyn Reyes',  h:'@brooklynr',       loc:'Los Angeles, USA',   f:312000, p:['ig','tt','yt'], niche:'Travel & Adventure',  rate:1200, turn:'14 days', rating:5.0, jobs:8,  bio:'Long form YouTube plus shorts. Averages 400k views per hotel feature.' },
    { id:'c5',  n:'Nadia Halvorsen', h:'@nadiah',          loc:'Oslo, Norway',       f:41800,  p:['ig','yt'],      niche:'Eco & Wellness',      rate:0,    turn:'9 days',  rating:4.6, jobs:12, bio:'Nordic eco lodges and wild swimming. Strong female 25 to 40 audience.' },
    { id:'c6',  n:'Theo Nakamura',   h:'@theonak',         loc:'Kyoto, Japan',       f:203000, p:['ig','tt'],      niche:'Luxury & Lifestyle',  rate:900,  turn:'7 days',  rating:4.9, jobs:31, bio:'Ryokan and boutique properties. Shoots in natural light only.' },
    { id:'c7',  n:'Priya Raman',     h:'@priyawanders',    loc:'Goa, India',         f:67300,  p:['ig','tt'],      niche:'Budget & Backpacker', rate:0,    turn:'6 days',  rating:4.5, jobs:19, bio:'Affordable stays for young travellers. Very high save rate.' },
    { id:'c8',  n:'Marcus Bell',     h:'@marcusbell',      loc:'Cape Town, SA',      f:158000, p:['yt','ig'],      niche:'Sports & Outdoors',   rate:750,  turn:'12 days', rating:4.8, jobs:26, bio:'Surf, hike, dive. Works with lodges near coastline and national parks.' },
    { id:'c9',  n:'Sofia Marchetti', h:'@sofiam',          loc:'Milan, Italy',       f:94500,  p:['ig'],           niche:'Luxury & Lifestyle',  rate:600,  turn:'8 days',  rating:4.7, jobs:22, bio:'Editorial stills. Her hotel work has run in three print magazines.' },
    { id:'c10', n:'Jonah Ward',      h:'@jonahward',       loc:'Queenstown, NZ',     f:38900,  p:['tt','yt'],      niche:'Travel & Adventure',  rate:0,    turn:'11 days', rating:4.4, jobs:9,  bio:'Adventure lodges and ski season. Drone certified.' },
    { id:'c11', n:'Leila Haddad',    h:'@leilahaddad',     loc:'Marrakesh, Morocco', f:176000, p:['ig','tt'],      niche:'Luxury & Lifestyle',  rate:850,  turn:'7 days',  rating:4.9, jobs:28, bio:'Riads and desert camps. Fluent in Arabic, French and English.' },
    { id:'c12', n:'Danny Oyelaran',  h:'@dannyotravels',   loc:'Lagos, Nigeria',     f:112000, p:['tt','ig'],      niche:'Entertainment',       rate:400,  turn:'5 days',  rating:4.6, jobs:15, bio:'Nightlife and city hotels. Strong reach across West Africa.' },
    { id:'c13', n:'Hana Kowalski',   h:'@hanakow',         loc:'Kraków, Poland',     f:29400,  p:['ig'],           niche:'Kid Friendly & Family',rate:0,   turn:'8 days',  rating:4.5, jobs:11, bio:'Family travel with two under ten. Practical, honest, high trust.' },
    { id:'c14', n:'Ruben Alves',     h:'@rubenalves',      loc:'São Paulo, Brazil',  f:421000, p:['tt','yt','ig'], niche:'Travel Tech & Gadgets',rate:1500,turn:'10 days', rating:4.8, jobs:34, bio:'Biggest account on the platform. Reviews hotel tech and smart rooms.' }
  ];

  var hotels = [
    { id:'h1',  n:'Seward Harbour Hotel',      loc:'Seward, Alaska',      score:10, rating:4.8, reviews:63,  season:'Summer', email:'stay@sewardharbour.com',    verified:true,  angles:['Alaska hidden island gems','Sustainable coastal lodging','Ultimate remote getaways'] },
    { id:'h2',  n:'Alyeska Resort',            loc:'Girdwood, Alaska',    score:9,  rating:4.6, reviews:122, season:'Winter', email:'press@alyeskaresort.com',   verified:true,  angles:['Ski in ski out','Northern lights from the room','Weekend from Anchorage'] },
    { id:'h3',  n:'Talkeetna Roadhouse',       loc:'Talkeetna, Alaska',   score:9,  rating:4.7, reviews:88,  season:'Fall',   email:'hello@talkeetnaroadhouse.com',verified:true, angles:['Practical travel hacks','Budget stopovers for road trips','Denali base camp'] },
    { id:'h4',  n:'Kenai Fjords Wilderness Lodge',loc:'Kenai, Alaska',    score:8,  rating:4.8, reviews:41,  season:'Summer', email:null,                        verified:false, angles:['Island accessible only by boat','Eco conscious luxury','Wildlife from your deck'] },
    { id:'h5',  n:'Palms Dania Beach',         loc:'Dania Beach, Florida',score:10, rating:4.4, reviews:310, season:'Winter', email:'marketing@palmsdania.com',  verified:true,  angles:['Ten minutes from the airport','Under the radar Miami','Pool day content'] },
    { id:'h6',  n:'MiraGrace Estate',          loc:'Miami, Florida',      score:9,  rating:4.9, reviews:57,  season:'Spring', email:'concierge@miragrace.com',   verified:true,  angles:['Private estate living','Wellness and fitness retreat','Design led interiors'] },
    { id:'h7',  n:'Casa Azul Tulum',           loc:'Tulum, Mexico',       score:8,  rating:4.5, reviews:204, season:'Winter', email:'stay@casaazultulum.mx',     verified:true,  angles:['Cenote access','Beach club mornings','Slow mornings in the jungle'] },
    { id:'h8',  n:'The Mayfair Rooms',         loc:'London, UK',          score:7,  rating:4.3, reviews:489, season:'Autumn', email:null,                        verified:false, angles:['Central London on a budget','Theatre district walkabout','Afternoon tea'] },
    { id:'h9',  n:'Fjordheim Lodge',           loc:'Ålesund, Norway',     score:9,  rating:4.9, reviews:76,  season:'Summer', email:'book@fjordheim.no',         verified:true,  angles:['Midnight sun','Fjord kayaking from the door','Nordic minimalism'] },
    { id:'h10', n:'Riad Amber',                loc:'Marrakesh, Morocco',  score:10, rating:4.8, reviews:158, season:'Spring', email:'salam@riadamber.ma',        verified:true,  angles:['Rooftop at golden hour','Souk to sanctuary','Traditional hammam'] },
    { id:'h11', n:'Alpina Zermatt',            loc:'Zermatt, Switzerland',score:6,  rating:4.7, reviews:233, season:'Winter', email:null,                        verified:false, angles:['Matterhorn from the balcony','Ski season opening','Alpine spa'] },
    { id:'h12', n:'Bondi Sands Hotel',         loc:'Sydney, Australia',   score:8,  rating:4.2, reviews:401, season:'Summer', email:'pr@bondisandshotel.au',     verified:true,  angles:['Sunrise swim culture','Coastal walk start point','Surf lesson package'] }
  ];

  var campaigns = [
    { id:'k1', t:'Summer Campaign',          prop:'Miami Hotel',        loc:'Miami, Florida',      from:'15 Sep 2026', to:'18 Sep 2026', type:'Hosted experience',      inc:'Room + meals',   status:'pending', apps:3,  cat:'Wellness & Fitness',  aud:'25K-50K',   del:[{t:'UGC Video',q:2},{t:'Photos',q:10}] },
    { id:'k2', t:'Fall Holiday',             prop:'Palms Dania Beach',  loc:'Dania Beach, Florida',from:'02 Oct 2026', to:'06 Oct 2026', type:'Hosted experience',      inc:'Full experience',status:'live',    apps:5,  cat:'Travel & Adventure',  aud:'50K-100K',  del:[{t:'UGC Video',q:3},{t:'Instagram Reels',q:2}] },
    { id:'k3', t:'Mayfair TikTok Campaign',  prop:'The Mayfair Rooms',  loc:'London, UK',          from:'20 Oct 2026', to:'23 Oct 2026', type:'Hosted + creative fee',  inc:'Room only',      status:'live',    apps:4,  cat:'Entertainment',       aud:'100K-250K', del:[{t:'TikTok',q:4}] },
    { id:'k4', t:'Belize Hotel Association', prop:'Belize Collective',  loc:'Placencia, Belize',   from:'11 Jun 2026', to:'16 Jun 2026', type:'Hosted experience',      inc:'Full experience',status:'closed',  apps:9,  cat:'Hotel & Resort UGC',  aud:'25K-50K',   del:[{t:'UGC Video',q:2},{t:'Photos',q:15}] },
    { id:'k5', t:'Riad Amber Spring Launch', prop:'Riad Amber',         loc:'Marrakesh, Morocco',  from:'04 Mar 2027', to:'09 Mar 2027', type:'Hosted + creative fee',  inc:'Full experience',status:'live',    apps:7,  cat:'Luxury & Lifestyle',  aud:'100K-250K', del:[{t:'UGC Video',q:2},{t:'Instagram Reels',q:3},{t:'Photos',q:20}] },
    { id:'k6', t:'Fjordheim Midnight Sun',   prop:'Fjordheim Lodge',    loc:'Ålesund, Norway',     from:'18 Jun 2027', to:'24 Jun 2027', type:'Hosted experience',      inc:'Room + meals',   status:'live',    apps:2,  cat:'Eco & Wellness',      aud:'25K-50K',   del:[{t:'Long-form content',q:1},{t:'Photos',q:12}] },
    { id:'k7', t:'Bondi Summer Series',      prop:'Bondi Sands Hotel',  loc:'Sydney, Australia',   from:'08 Dec 2026', to:'12 Dec 2026', type:'Paid creator campaign',  inc:'Room only',      status:'live',    apps:11, cat:'Sports & Outdoors',   aud:'50K-100K',  del:[{t:'UGC Video',q:4},{t:'Stories',q:6}] },
    { id:'k8', t:'Casa Azul Wellness Week',  prop:'Casa Azul Tulum',    loc:'Tulum, Mexico',       from:'22 Jan 2027', to:'28 Jan 2027', type:'Hosted experience',      inc:'Full experience',status:'live',    apps:6,  cat:'Wellness & Fitness',  aud:'50K-100K',  del:[{t:'UGC Video',q:3},{t:'Instagram Reels',q:2}] },
    { id:'k9', t:'Zermatt Season Opening',   prop:'Alpina Zermatt',     loc:'Zermatt, Switzerland',from:'01 Dec 2026', to:'05 Dec 2026', type:'Hosted + creative fee',  inc:'Room + meals',   status:'draft',   apps:0,  cat:'Sports & Outdoors',   aud:'250K-500K', del:[{t:'UGC Video',q:2}] }
  ];

  /* one thread per stage so every step of the order flow is reachable */
  var threads = [
    { id:'t1', who:'c2',  camp:'k2', stage:0, unread:2, when:'8 days ago', msgs:[
      { by:'them', at:'8 days ago', tx:'Hi, I would love to apply for Fall Holiday. I shoot fast UGC and always hand over raw files. My last resort feature did 240k views in a week.' },
      { by:'them', at:'6 days ago', tx:'Following up in case this got buried. Happy to send a sample edit if useful.' } ] },
    { id:'t2', who:'c3',  camp:'k2', stage:1, unread:0, when:'5 days ago', msgs:[
      { by:'them', at:'9 days ago', tx:'Applying for Fall Holiday. I focus on restaurant and bar content, which looks like a gap in your current gallery.' },
      { by:'me',   at:'5 days ago', tx:'We like the food angle. Sending you an offer for a three night hosted stay, two UGC videos and ten photos.' } ] },
    { id:'t3', who:'c1',  camp:'k5', stage:2, unread:1, when:'3 days ago', msgs:[
      { by:'them', at:'12 days ago', tx:'The Riad Amber launch looks perfect for my audience. I was in Marrakesh last spring and the rooftop content performed extremely well.' },
      { by:'me',   at:'8 days ago',  tx:'Offer sent. Five nights, full experience, plus the creative fee.' },
      { by:'them', at:'3 days ago',  tx:'Accepted. I can do 4 to 9 March. Flights are flexible either side by a day.' } ] },
    { id:'t4', who:'c6',  camp:'k5', stage:3, unread:0, when:'2 days ago', msgs:[
      { by:'me',   at:'6 days ago', tx:'Dates confirmed for 4 to 9 March. Brief attached below.' },
      { by:'me',   at:'2 days ago', tx:'Brief: two UGC videos, three reels, twenty photos. Please lead with the rooftop at golden hour and include the hammam.' } ] },
    { id:'t5', who:'c11', camp:'k5', stage:4, unread:0, when:'yesterday', msgs:[
      { by:'them', at:'4 days ago', tx:'Brief accepted. Booked my flights, arriving the afternoon of the 4th.' },
      { by:'me',   at:'yesterday',  tx:'Wonderful. Reception has your name and the suite is held. Ask for Yusuf on arrival.' } ] },
    { id:'t6', who:'c9',  camp:'k3', stage:5, unread:3, when:'6 hours ago', msgs:[
      { by:'me',   at:'3 weeks ago', tx:'Stay complete, hope it went well. Content due within fourteen days per the brief.' },
      { by:'them', at:'6 hours ago', tx:'All delivered. Four TikToks plus the raw files. The second one is already at 90k views organically.' } ] },
    { id:'t7', who:'c4',  camp:'k3', stage:6, unread:0, when:'2 days ago', msgs:[
      { by:'them', at:'5 days ago', tx:'Submitted everything. Let me know if you want any changes to the edit.' },
      { by:'me',   at:'2 days ago', tx:'Reviewing now with the team. One small note coming on the opening shot.' } ] },
    { id:'t8', who:'c5',  camp:'k4', stage:7, unread:0, when:'6 weeks ago', msgs:[
      { by:'me',   at:'7 weeks ago', tx:'Content received and approved. Thank you, this was one of our strongest sets this year.' },
      { by:'them', at:'6 weeks ago', tx:'Thank you. Would love to come back for the winter season if you run another campaign.' } ] },
    { id:'t9', who:'c7',  camp:'k7', stage:0, unread:1, when:'1 day ago', msgs:[
      { by:'them', at:'1 day ago', tx:'Applying for Bondi Summer Series. My audience skews 18 to 28 and saves a lot of budget travel content.' } ] },
    { id:'t10',who:'c14', camp:'k7', stage:1, unread:0, when:'4 days ago', msgs:[
      { by:'them', at:'6 days ago', tx:'Interested in the Bondi campaign. I would want to cover the smart room tech alongside the beach content.' },
      { by:'me',   at:'4 days ago', tx:'Offer sent, four nights room only plus the fee. The tech angle works for us.' } ] }
  ];

  var academy = [
    { id:'a1', t:'Pitching hotels that never reply',   len:'12 min', done:true,  mod:'Getting started', d:'Why most pitches fail in the subject line, and the four openers that get opened.' },
    { id:'a2', t:'Building a media kit worth sending', len:'18 min', done:true,  mod:'Getting started', d:'The five numbers a hotel actually cares about, and the ones to leave out.' },
    { id:'a3', t:'Pricing your first paid campaign',   len:'22 min', done:true,  mod:'Getting started', d:'How to move from free stays to a creative fee without losing the relationship.' },
    { id:'a4', t:'Shooting a hotel in one day',        len:'26 min', done:false, mod:'On location',     d:'A shot list that covers rooms, food, amenity and exterior before checkout.' },
    { id:'a5', t:'Natural light in difficult rooms',   len:'15 min', done:false, mod:'On location',     d:'Dark suites, north facing windows and mixed colour temperature.' },
    { id:'a6', t:'Filming yourself without a crew',    len:'19 min', done:false, mod:'On location',     d:'Framing, focus and audio when you are the only person in the room.' },
    { id:'a7', t:'Editing for saves, not for likes',   len:'24 min', done:false, mod:'After the stay',  d:'Pacing and hooks that push a travel video into the save and share pile.' },
    { id:'a8', t:'Turning one stay into six months',   len:'21 min', done:false, mod:'After the stay',  d:'Repurposing a single trip across platforms without the audience noticing.' }
  ];

  var plans = {
    creator: [
      { n:'Free',       p:'$0',   per:'forever',  feats:['Browse open campaigns','Apply to three campaigns a month','Basic profile'], cur:false },
      { n:'Creator Pro',p:'$29',  per:'a month',  feats:['Unlimited applications','Pitch Pilot with verified contacts','Verified creator badge','Creator Academy in full','Travel insurance while on a stay'], cur:true },
      { n:'Pro Annual', p:'$290', per:'a year',   feats:['Everything in Creator Pro','Two months free','Priority placement in the Rolodex','Direct line to the partnerships team'], cur:false }
    ],
    brand: [
      { n:'Listing',    p:'$0',   per:'forever',  feats:['Post unlimited campaigns','Receive applications','Basic property profile'], cur:false },
      { n:'Hotel Access',p:'$299',per:'a month',  feats:['Search all 391 creators','Contact creators directly','Filters by audience, platform and niche','Campaign analytics','Priority support'], cur:true },
      { n:'White Glove',p:'Custom',per:'per campaign',feats:['We source and vet the creators','Managed briefs and delivery','Contracted usage rights','Quarterly performance review'], cur:false }
    ]
  };

  var notifications = [
    { t:'Kelvis Carter applied to Fall Holiday',    when:'8 days ago',  unread:true },
    { t:'Sofia Marchetti submitted content',        when:'6 hours ago', unread:true },
    { t:'Amara Mensah accepted your offer',         when:'3 days ago',  unread:true },
    { t:'Summer Campaign is pending approval',      when:'yesterday',   unread:false },
    { t:'Your Hotel Access renews on 12 August',    when:'2 days ago',  unread:false }
  ];

  var me = { id:'me', n:'Robert Torres', h:'@roborobt', loc:'Miami, Florida', f:160200,
             p:['ig','tt'], niche:'Luxury & Lifestyle', rate:0, turn:'10 days', rating:4.8, jobs:7,
             bio:'Travel creator covering design led hotels and resorts. Raw files always included.' };

  var applied = {};   // campaignId -> threadId, filled in when you apply

  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K' : String(n); }

  return {
    STAGES: STAGES, creators: creators, hotels: hotels, campaigns: campaigns,
    threads: threads, academy: academy, plans: plans, notifications: notifications,
    me: me,
    applied: applied,
    creator: function (id) { return id === 'me' ? me : byId(creators, id); },
    addThread: function (t) { threads.unshift(t); return t; },
    campaign: function (id) { return byId(campaigns, id); },
    fmt: fmt,
    initials: function (name) { return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join(''); }
  };
})();
