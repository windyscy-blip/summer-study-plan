/* Shared card catalog for the summer check-in pages. */
(function () {
  const CARD_POOL = [
    { id: 'r-apple-glow', rarity: 'R', name: '苹果晨光', skill: '晨读能量', description: '清晨系 R 卡，适合配合语文晨读和字词复习。', accent: '晨读之星', colors: { a: '#ffc3d4', b: '#ff76a8', c: '#ffe38a', mane1: '#ff6a98', mane2: '#ffcc4d', body: '#fff8fd' }, mark: '✦', persona: '晨读领航员 / 语文唤醒', personality: '温柔准时，见到第一缕阳光就会轻轻提醒开口朗读。', mission: '陪你把早晨第一段课文读得清亮又自信。', story: '她喜欢把苹果香味藏进风里，每次你翻开书页，她都会先把害羞的声音变成响亮的声音。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-cloud-bubble', rarity: 'R', name: '云朵泡泡', skill: '阅读陪伴', description: '轻盈阅读系 R 卡，适合快乐读书吧和睡前鼓励。', accent: '阅读之云', colors: { a: '#cfeeff', b: '#76c5ff', c: '#e0d2ff', mane1: '#62bcff', mane2: '#9a78ff', body: '#ffffff' }, mark: '☁', persona: '绘本陪读员 / 阅读安抚', personality: '轻轻软软，很会陪你慢慢读完整本书。', mission: '让快乐读书吧和睡前共读都变得更安静、更投入。', story: '她会把云朵折成一张张书签，替你记住今天读到哪里，明天再继续冒险。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-mint-hop', rarity: 'R', name: '薄荷跳跳', skill: '数感冲刺', description: '清新数感系 R 卡，适合数学练习日。', accent: '数感闪光', colors: { a: '#ddfff2', b: '#86e0be', c: '#d9f5ff', mane1: '#5fd2aa', mane2: '#65c7ff', body: '#f8fffd' }, mark: '◆', persona: '口算热身员 / 数学陪跑', personality: '灵巧有劲，总能把数字练习变成轻快小游戏。', mission: '帮你在开始写题前先把数感热起来。', story: '她跑过地面时会留下薄荷色的小脚印，每一步都像在提醒你：再快一点，也要算得准。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-sea-star', rarity: 'R', name: '海盐星铃', skill: '单词记忆', description: '蓝调背词系 R 卡，适合单词抄写 + 默写。', accent: '单词清铃', colors: { a: '#e5f2ff', b: '#7fb7ff', c: '#fff0f8', mane1: '#79a7ff', mane2: '#ff87c7', body: '#ffffff' }, mark: '✧', persona: '单词小邮差 / 记忆陪练', personality: '清醒认真，最擅长把长长的单词拆成好记的小节奏。', mission: '陪你完成单词抄写、默写和口头回忆。', story: '海风一吹，她脖子上的星铃就会响起来，每响一下，你就更容易记住一个词。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-candy-book', rarity: 'R', name: '糖霜书书', skill: '绘本跟读', description: '甜系绘本 R 卡，适合英语乐读绘本。', accent: '绘本糖心', colors: { a: '#ffe8f3', b: '#ff9dc4', c: '#fff2c8', mane1: '#ff7fb0', mane2: '#ffd36d', body: '#fffdfd' }, mark: '❤', persona: '英文绘本搭档 / 跟读鼓励', personality: '甜甜的、很会夸人，读对一句就想给你一颗糖心星。', mission: '让英语跟读更顺口，敢开口、敢模仿。', story: '她收藏了很多奶油色的故事页，每当你跟读完整一段，她就会在页角画一个小爱心。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-rain-step', rarity: 'R', name: '雨滴飞飞', skill: '动画补给', description: '轻松输入系 R 卡，适合动画片和单词小超市。', accent: '轻松输入', colors: { a: '#e7f9ff', b: '#78d1ff', c: '#eef0ff', mane1: '#6dc8ff', mane2: '#8e86ff', body: '#fbffff' }, mark: '✿', persona: '轻输入向导 / 英语耳朵热身', personality: '活泼不吵闹，很会把学习和放松调成刚刚好的比例。', mission: '陪你在动画输入里悄悄积攒语感和单词熟悉度。', story: '小雨滴会在她脚边跳来跳去，像一串串节拍，帮你把听到的英语留在脑海里。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-lemon-note', rarity: 'R', name: '柠檬练练', skill: '订正耐心', description: '练习订正系 R 卡，提醒做完后别忘了订正。', accent: '订正闪记', colors: { a: '#fff8cb', b: '#ffd96a', c: '#ffe5f6', mane1: '#ffd45b', mane2: '#ff92cd', body: '#fffef7' }, mark: '♫', persona: '订正提醒员 / 作业收尾', personality: '认真细致，越到最后越精神。', mission: '陪你把“写完了”升级成“检查好了、订正好了”。', story: '她把柠檬香味藏进音符里，遇到粗心的小地方，就会轻轻哼一声提醒你再看一眼。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-peach-dew', rarity: 'R', name: '蜜桃晨露', skill: '生字清扫', description: '粉桃系 R 卡，适合早晨温柔复习生字和词语。', accent: '粉露翻页', colors: { a: '#ffe5ef', b: '#ff9fbe', c: '#fff1c9', mane1: '#ff8eb2', mane2: '#ffd37a', body: '#fffdfd' }, mark: '❀', persona: '词语整理员 / 生字陪练', personality: '软糯细心，说话像桃子汽水一样轻轻冒泡。', mission: '陪你把难记的生字一笔一画写稳当。', story: '她的鬃毛会在本子边缘落下亮晶晶的露点，写对一个字，就亮起一颗。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-kite-sky', rarity: 'R', name: '晴空纸鸢', skill: '朗读节奏', description: '晴空系 R 卡，适合课文跟读和节奏练习。', accent: '风筝巡游', colors: { a: '#dff2ff', b: '#81cfff', c: '#fff1d8', mane1: '#6fbfff', mane2: '#ffd481', body: '#fcffff' }, mark: '☼', persona: '节奏小队长 / 朗读陪跑', personality: '轻快开朗，特别会带着你一行一行读顺。', mission: '把卡住的句子读出风一样的流畅感。', story: '她最喜欢把风筝线缠在晨风上，只要你愿意继续读，她就会把节奏轻轻拉回来。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-berry-bell', rarity: 'R', name: '草莓铃铛', skill: '听写提醒', description: '草莓系 R 卡，适合单词听写和口头复述。', accent: '铃铃小答题', colors: { a: '#ffe2ef', b: '#ff88b5', c: '#ffd6e8', mane1: '#ff6f9d', mane2: '#ffb36f', body: '#fffdfd' }, mark: '❉', persona: '听写助理 / 复述鼓励', personality: '俏皮机灵，答对时会开心地晃动小铃铛。', mission: '陪你把“我好像记得”变成“我能说出来”。', story: '她的铃铛能记住每一次勇敢开口的声音，复述得越完整，铃声就越清亮。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-shell-sugar', rarity: 'R', name: '奶糖贝壳', skill: '绘本安静力', description: '贝壳系 R 卡，适合安静坐下来读绘本和桥梁书。', accent: '奶糖海风', colors: { a: '#fff2df', b: '#ffd3a0', c: '#e7f5ff', mane1: '#ffcf9b', mane2: '#91cbff', body: '#fffefb' }, mark: '◍', persona: '安静阅读师 / 坐定陪伴', personality: '安安静静，最会把翻书时间变得柔软又专注。', mission: '帮助你稳稳坐住，把一本书读到想看的地方。', story: '她把海边听来的浪声装进贝壳里，翻页时会发出轻轻的沙沙声，像在陪你一起读。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-star-bookmark', rarity: 'R', name: '星星书签', skill: '阅读定位', description: '书签系 R 卡，适合阅读时找到重点句和好词。', accent: '摘句小光标', colors: { a: '#fff7db', b: '#ffd974', c: '#e8e9ff', mane1: '#ffc95a', mane2: '#8e92ff', body: '#fffef9' }, mark: '✎', persona: '重点捕手 / 摘句助手', personality: '认真又有条理，喜欢把重点轻轻圈出来。', mission: '陪你找到好词好句，也帮你记住关键地方。', story: '她住在一本会发光的书里，看到精彩句子时，就会跳出来变成一枚闪闪的小书签。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-blueberry-spin', rarity: 'R', name: '蓝莓转转', skill: '口算热身', description: '蓝莓系 R 卡，适合数学口算和数感热身。', accent: '蓝莓转盘', colors: { a: '#e3ecff', b: '#87a8ff', c: '#dff8ff', mane1: '#6f8cff', mane2: '#71d3ff', body: '#fbfdff' }, mark: '◎', persona: '数字转盘手 / 口算陪练', personality: '反应快、笑容亮，越是需要专心越有干劲。', mission: '帮你把口算手感转起来，进入数学状态。', story: '她的蹄尖轻轻一转，空中就会出现一圈圈蓝莓色数字，等你把答案稳稳接住。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'r-vanilla-breeze', rarity: 'R', name: '香草微风', skill: '作业收尾', description: '香草系 R 卡，适合写完作业后的检查与订正。', accent: '香草收尾', colors: { a: '#fff6df', b: '#f5d48a', c: '#e9ffe9', mane1: '#f0c86e', mane2: '#89d8ad', body: '#fffef9' }, mark: '❋', persona: '收尾护理员 / 检查陪伴', personality: '耐心柔和，总能在最后一步把节奏稳住。', mission: '提醒你检查漏题、错字和没订正完的小地方。', story: '她最爱在作业本合上前吹一阵香草风，把容易漏看的角落都吹得亮亮的。', obtain: '可在卡片库消耗 3 颗星解锁，也可能在连续 3 天满进度奖励中随机获得。' },
    { id: 'sr-rainbow-dash', rarity: 'SR', name: '彩虹逐风', skill: '满进度加速', description: '高闪 SR 卡，适合状态特别好的满进度日。', accent: '彩虹冲刺', colors: { a: '#dff7ff', b: '#62c4ff', c: '#ffe6f8', mane1: '#ff73aa', mane2: '#6f85ff', body: '#ffffff' }, mark: '⚡', persona: '冲刺领跑员 / 满进度加速', personality: '又亮又飒，最喜欢在你快完成时给出最后一脚加速。', mission: '陪你把还差一点点的进度一鼓作气做完。', story: '她从彩虹尾巴里抽出一束风，把拖拖拉拉的最后几项变成啪嗒啪嗒亮起来的勾勾。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-purple-magic', rarity: 'SR', name: '紫晶星语', skill: '专注魔法', description: '紫系 SR 卡，适合课程期间也不掉节奏的时候。', accent: '专注魔法', colors: { a: '#efe4ff', b: '#a77dff', c: '#ffdff1', mane1: '#8f63ff', mane2: '#ff91cb', body: '#fffaff' }, mark: '✪', persona: '专注法师 / 课堂续航', personality: '安静笃定，最擅长把注意力重新轻轻拉回来。', mission: '陪你在课程和作业切换之间也保持专注。', story: '她会把漂走的小念头装进紫晶泡泡里，让桌面前只剩下今天最重要的一件事。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-moon-berry', rarity: 'SR', name: '月莓旋律', skill: '夜晚收尾', description: '夜色 SR 卡，适合晚上完成作业与动画输入。', accent: '晚安旋律', colors: { a: '#ece9ff', b: '#8f8aff', c: '#ffe5f2', mane1: '#7c75ff', mane2: '#ff8cb8', body: '#fffefe' }, mark: '☾', persona: '晚间伴学者 / 节奏收束', personality: '温柔沉静，越到傍晚越会发光。', mission: '陪你把晚上的学习收得整齐又从容。', story: '她在月光下练习轻轻的旋律，写完作业的人会听见那首“今天辛苦啦”的晚安歌。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-aurora-glow', rarity: 'SR', name: '极光闪闪', skill: '连胜追光', description: '极光 SR 卡，适合三连胜或七连胜掉落。', accent: '追光连胜', colors: { a: '#e4fff8', b: '#67ddb7', c: '#e8f0ff', mane1: '#62d5b0', mane2: '#77b5ff', body: '#fcffff' }, mark: '✺', persona: '连胜点灯员 / 坚持奖励', personality: '明亮灵动，看见连续完成就会开心地绕圈飞。', mission: '让“坚持几天”这件事变得看得见、摸得着。', story: '她把每一次连续满进度都挂成一段极光，等你回头时，就能看到自己一路发亮。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-glass-comet', rarity: 'SR', name: '琉璃流星', skill: '难题跃迁', description: '流星 SR 卡，适合攻克有点绕的题目与连招任务。', accent: '流星加速', colors: { a: '#e8f1ff', b: '#8db6ff', c: '#ffe6fb', mane1: '#7d97ff', mane2: '#ff9bd6', body: '#ffffff' }, mark: '☄', persona: '闯关导航员 / 难题突破', personality: '勇敢机灵，越遇到弯弯题目越兴奋。', mission: '陪你把“再想一下”变成“我会了”。', story: '每当你认真停下来思考，她的尾迹就会在空中连成一条亮亮的答案线。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-garland-aria', rarity: 'SR', name: '花环咏叹', skill: '复述舞台', description: '花环 SR 卡，适合语文复述、表达和背诵展示。', accent: '花舞舞台', colors: { a: '#fbe6ff', b: '#c28cff', c: '#ffeccf', mane1: '#ae74ff', mane2: '#ffbc7d', body: '#fffbff' }, mark: '❁', persona: '表达小主演 / 背诵助演', personality: '大方自信，特别会给人站到台前的勇气。', mission: '陪你把背诵、复述和表达说得更完整更好听。', story: '她的花环会在你开口时一片片亮起来，像小小舞台灯在为你鼓掌。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-sugar-aurora', rarity: 'SR', name: '雪糖极光', skill: '连胜蓄力', description: '糖霜极光 SR 卡，适合状态连续在线的时候。', accent: '甜光追分', colors: { a: '#eefcff', b: '#87e0ff', c: '#f3e5ff', mane1: '#7ad3ff', mane2: '#b487ff', body: '#fcffff' }, mark: '✹', persona: '状态蓄能师 / 连胜鼓励', personality: '清亮轻盈，最会在你越做越顺时继续加油。', mission: '把今天的好状态稳稳接到下一项任务里。', story: '她把糖霜撒进极光里，只要你没停下脚步，头顶就会一直亮着甜甜的光。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'sr-starlight-post', rarity: 'SR', name: '星河信使', skill: '计划速递', description: '信使 SR 卡，适合安排学习顺序和清单收尾。', accent: '星邮快递', colors: { a: '#eef0ff', b: '#9a95ff', c: '#ffe8f7', mane1: '#837cff', mane2: '#ff9bcb', body: '#fffeff' }, mark: '✉', persona: '清单快递员 / 顺序整理', personality: '可靠利落，最擅长把乱糟糟的任务排成整齐队伍。', mission: '帮助你想清楚先做什么、后做什么。', story: '她会把一张张星光便签送到你桌边，每张便签上都写着下一步最该做的事。', obtain: '可在卡片库消耗 6 颗星解锁，也可能在连续 3 天或 7 天满进度奖励中随机获得。' },
    { id: 'ssr-sun-crown', rarity: 'SSR', name: '日冕王冠', skill: '七日大奖', description: '金边 SSR 卡，只能通过 7 天满进度随机掉落。', accent: '日冕闪耀', colors: { a: '#fff6d6', b: '#f4c34b', c: '#ffe4ef', mane1: '#f3ba34', mane2: '#ff8db7', body: '#fffdf7' }, mark: '♛', persona: '七日庆典王 / 全勤荣耀', personality: '耀眼又庄重，但每次出现都会先向认真努力的人低头致意。', mission: '把七天坚持的光芒化成可以收藏的大奖时刻。', story: '传说只要把一整周的任务全部认真点亮，她的王冠就会在晨光里打开一圈圈金色光环。', obtain: '仅会在连续 7 天满进度奖励中随机获得。' },
    { id: 'ssr-galaxy-dream', rarity: 'SSR', name: '银河梦境', skill: '终极收藏', description: '梦幻 SSR 卡，只能通过 7 天满进度随机掉落。', accent: '梦境王座', colors: { a: '#f6e9ff', b: '#bd87ff', c: '#fff3d2', mane1: '#9a66ff', mane2: '#ffcf67', body: '#fffaff' }, mark: '✵', persona: '梦境收藏家 / 终章奖励', personality: '神秘温柔，像会把愿望认真收好的人。', mission: '让努力完成的一周，变成梦幻又难忘的收藏结尾。', story: '她把星星折成梦境书页，只有连续发光七天的人，才能翻到那一页最亮的银河。', obtain: '仅会在连续 7 天满进度奖励中随机获得。' },
    { id: 'ssr-rainbow-castle', rarity: 'SSR', name: '彩虹王廷', skill: '全勤凯旋', description: '王廷 SSR 卡，适合七天满进度后闪耀登场。', accent: '凯旋王廷', colors: { a: '#fff7d9', b: '#f7c95e', c: '#ffe3f6', mane1: '#ff9fcb', mane2: '#8fb7ff', body: '#fffdf8' }, mark: '♕', persona: '全勤庆典长 / 彩虹终章', personality: '华丽但不高冷，最爱在你坚持到底时铺开彩带。', mission: '把整周努力变成值得珍藏的庆典时刻。', story: '传说只有把七天都认真点亮的人，才能看见她的彩虹宫灯一盏一盏同时亮起。', obtain: '仅会在连续 7 天满进度奖励中随机获得。' },
    { id: 'ssr-moonlit-legend', rarity: 'SSR', name: '星月秘语', skill: '梦想珍藏', description: '秘语 SSR 卡，适合七天满进度后的终极收藏。', accent: '月辉秘章', colors: { a: '#f4ebff', b: '#c090ff', c: '#fff1cf', mane1: '#9d6dff', mane2: '#ffd77b', body: '#fffaff' }, mark: '✶', persona: '月辉守秘者 / 梦想终奖', personality: '安静神秘，像把每份认真都写进夜空里的朋友。', mission: '把你一整周的耐心和坚持，变成会发光的纪念故事。', story: '她会在月亮最圆的夜里念出努力者的名字，让那份坚持留在星光做成的秘章里。', obtain: '仅会在连续 7 天满进度奖励中随机获得。' }
  ];

  function rarityClass(rarity) {
    return rarity === 'SSR' ? 'ssr' : rarity === 'SR' ? 'sr' : 'r';
  }

  function getCard(cardId) {
    return CARD_POOL.find((item) => item.id === cardId);
  }

  const CARD_ARTWORK = {
      'r-apple-glow': 'cards/r-apple-glow.webp',
      'r-cloud-bubble': 'cards/r-cloud-bubble.webp',
      'r-mint-hop': 'cards/r-mint-hop.webp',
      'r-sea-star': 'cards/r-sea-star.webp',
      'r-candy-book': 'cards/r-candy-book.webp',
      'r-rain-step': 'cards/r-rain-step.webp',
      'r-lemon-note': 'cards/r-lemon-note.webp',
      'r-peach-dew': 'cards/r-peach-dew.webp',
      'r-kite-sky': 'cards/r-kite-sky.webp',
      'r-berry-bell': 'cards/r-berry-bell.webp',
      'r-shell-sugar': 'cards/r-shell-sugar.webp',
      'r-star-bookmark': 'cards/r-star-bookmark.webp',
      'r-blueberry-spin': 'cards/r-blueberry-spin.webp',
      'r-vanilla-breeze': 'cards/r-vanilla-breeze.webp',
      'sr-rainbow-dash': 'cards/sr-rainbow-dash.webp',
      'sr-purple-magic': 'cards/sr-purple-magic.webp',
      'sr-moon-berry': 'cards/sr-moon-berry.webp',
      'sr-aurora-glow': 'cards/sr-aurora-glow.webp',
      'sr-glass-comet': 'cards/sr-glass-comet.webp',
      'sr-garland-aria': 'cards/sr-garland-aria.webp',
      'sr-sugar-aurora': 'cards/sr-sugar-aurora.webp',
      'sr-starlight-post': 'cards/sr-starlight-post.webp',
      'ssr-sun-crown': 'cards/ssr-sun-crown.webp',
      'ssr-galaxy-dream': 'cards/ssr-galaxy-dream.webp',
      'ssr-rainbow-castle': 'cards/ssr-rainbow-castle.webp',
      'ssr-moonlit-legend': 'cards/ssr-moonlit-legend.webp'
    };

  let pendingUnlockCardId = null;

function buildPonySvg(card) {
  if (CARD_ARTWORK[card.id]) {
    return `<img src="${CARD_ARTWORK[card.id]}" alt="${card.name}" loading="lazy" />`;
  }
  const c = card.colors;
  const rarity = card.rarity;
  const decoMap = {
    'r-apple-glow': { icon: '🍎', orbit: 'none', frame: 'none', background: 'apple-clean', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'r-cloud-bubble': { icon: '☁', orbit: 'none', frame: 'none', background: 'cloud-clean', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'r-mint-hop': { icon: '◆', orbit: 'mint', frame: 'spark', background: 'mint-soft', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'r-sea-star': { icon: '✧', orbit: 'star', frame: 'ribbon', background: 'sea-soft', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'r-candy-book': { icon: '❤', orbit: 'heart', frame: 'hearts', background: 'candy-soft', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'r-rain-step': { icon: '✿', orbit: 'rain', frame: 'drops', background: 'rain-soft', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'r-lemon-note': { icon: '♫', orbit: 'note', frame: 'notes', background: 'note-soft', pedestal: 'none', headpiece: 'none', tail: 'basic' },
    'sr-rainbow-dash': { icon: '⚡', orbit: 'rainbow', frame: 'flare', background: 'rainbow-rich', pedestal: 'rainbow-band', headpiece: 'none', tail: 'basic' },
    'sr-purple-magic': { icon: '✪', orbit: 'magic', frame: 'gems', background: 'magic-rich', pedestal: 'magic-band', headpiece: 'none', tail: 'basic' },
    'sr-moon-berry': { icon: '☾', orbit: 'moon', frame: 'stars', background: 'moon-rich', pedestal: 'moon-band', headpiece: 'none', tail: 'basic' },
    'sr-aurora-glow': { icon: '✺', orbit: 'aurora', frame: 'aurora', background: 'aurora-rich', pedestal: 'aurora-band', headpiece: 'none', tail: 'basic' },
    'ssr-sun-crown': { icon: '♛', orbit: 'sun', frame: 'royal', background: 'sun-palace', pedestal: 'sun-band', headpiece: 'sun-tiara', tail: 'royal-tail' },
    'ssr-galaxy-dream': { icon: '✵', orbit: 'galaxy', frame: 'cosmic', background: 'galaxy-rich', pedestal: 'comet-band', headpiece: 'star-circlet', tail: 'galaxy-tail' }
  };
  const deco = decoMap[card.id] || {
    icon: card.mark,
    orbit: rarity === 'SSR' ? 'galaxy' : rarity === 'SR' ? 'magic' : 'leaf',
    frame: rarity === 'SSR' ? 'royal' : rarity === 'SR' ? 'gems' : 'dots',
    background: rarity === 'SSR' ? 'galaxy-rich' : rarity === 'SR' ? 'magic-rich' : 'apple-soft',
    pedestal: rarity === 'SSR' ? 'comet-band' : rarity === 'SR' ? 'magic-band' : 'none',
    headpiece: rarity === 'SSR' ? 'star-circlet' : 'none',
    tail: rarity === 'SSR' ? 'galaxy-tail' : 'basic'
  };

  function backdrop() {
    switch (deco.background) {
      case 'apple-clean':
        return `<rect x="32" y="34" width="112" height="128" rx="32" fill="rgba(255,188,205,.62)"/><rect x="40" y="44" width="96" height="108" rx="28" fill="rgba(255,236,191,.34)"/><path d="M52 156c18-8 36-9 56-4 10 2 20 2 30 0" fill="none" stroke="rgba(255,151,185,.36)" stroke-width="8" stroke-linecap="round"/><path d="M106 50c8-9 17-13 27-12 1 11-3 20-11 26-9 0-17-5-24-15 2-4 5-7 8-9z" fill="rgba(255,112,156,.52)"/><circle cx="71" cy="58" r="13" fill="rgba(255,224,132,.86)"/>`;
      case 'cloud-clean':
        return `<rect x="32" y="34" width="112" height="128" rx="32" fill="rgba(180,223,255,.62)"/><rect x="40" y="44" width="96" height="108" rx="28" fill="rgba(225,218,255,.34)"/><path d="M52 156c18-7 36-8 56-5 10 2 20 1 30-2" fill="none" stroke="rgba(153,205,255,.42)" stroke-width="8" stroke-linecap="round"/><ellipse cx="72" cy="57" rx="17" ry="9" fill="rgba(255,255,255,.82)"/><ellipse cx="111" cy="51" rx="19" ry="10" fill="rgba(255,255,255,.72)"/>`;
      case 'apple-soft':
        return `<rect x="14" y="18" width="140" height="156" rx="36" fill="rgba(255,138,176,.4)"/><rect x="22" y="28" width="124" height="134" rx="32" fill="rgba(255,221,139,.28)"/><path d="M18 164c18-8 39-10 62-5 19 4 38 4 56 0 11-2 21-5 30-10v25H18z" fill="rgba(148,223,160,.42)"/><circle cx="36" cy="40" r="14" fill="rgba(255,236,165,.8)"/><path d="M116 42c8-8 16-11 24-10 1 10-2 18-9 24-9 1-17-4-24-14 3-3 6-6 9-8z" fill="rgba(255,126,164,.48)"/>`;
      case 'cloud-soft':
        return `<rect x="14" y="18" width="140" height="156" rx="36" fill="rgba(133,198,255,.36)"/><rect x="22" y="28" width="124" height="134" rx="32" fill="rgba(214,201,255,.24)"/><path d="M18 164c19-8 39-10 61-8 19 2 38 1 56-4 11-4 21-8 29-14v26H18z" fill="rgba(174,216,255,.4)"/><ellipse cx="46" cy="40" rx="18" ry="9" fill="rgba(255,255,255,.72)"/><ellipse cx="126" cy="34" rx="21" ry="10" fill="rgba(255,255,255,.58)"/>`;
      case 'mint-soft':
        return `<path d="M18 164c21-8 43-10 67-6 18 4 36 3 55-2v24H18z" fill="rgba(146,228,201,.16)"/><path d="M32 50c9-11 21-13 36-8-6 10-16 15-31 15" fill="rgba(255,255,255,.22)"/><path d="M116 46c7 9 8 16 2 22-9-4-13-10-13-19" fill="rgba(116,205,255,.16)"/>`;
      case 'sea-soft':
        return `<path d="M18 165c18-7 39-8 62-5 20 3 41 3 64-1v22H18z" fill="rgba(124,206,255,.18)"/><path d="M18 152c20-7 40-9 61-5 22 3 43 3 64-1" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="4" stroke-linecap="round"/><text x="124" y="48" font-size="13" font-weight="700" fill="rgba(255,255,255,.42)">✧</text>`;
      case 'candy-soft':
        return `<rect x="24" y="30" width="28" height="56" rx="10" fill="rgba(255,255,255,.12)"/><path d="M26 160c20-6 42-7 66-4 17 3 34 3 51 0" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="5" stroke-linecap="round"/><path d="M124 42c-5-6 2-14 9-10 2 2 4 4 5 6 1-2 2-4 5-6 7-4 14 4 9 10-4 5-14 11-14 11s-10-6-14-11z" fill="rgba(255,156,194,.24)"/>`;
      case 'rain-soft':
        return `<g stroke="rgba(255,255,255,.24)" stroke-width="3" stroke-linecap="round"><path d="M34 24l-5 15"/><path d="M60 18l-5 16"/><path d="M120 24l-5 15"/><path d="M146 18l-5 16"/></g><ellipse cx="128" cy="164" rx="25" ry="8" fill="rgba(118,205,255,.18)"/>`;
      case 'note-soft':
        return `<rect x="28" y="48" width="42" height="50" rx="10" fill="rgba(255,255,255,.12)"/><path d="M38 62h20M38 74h17M38 86h22" stroke="rgba(255,216,122,.48)" stroke-width="3" stroke-linecap="round"/><text x="124" y="48" font-size="14" font-weight="700" fill="rgba(255,255,255,.4)">♫</text>`;
      case 'rainbow-rich':
        return `<path d="M18 156c18 9 39 13 64 13 24 0 46-4 66-13" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="6" stroke-linecap="round"/><path d="M22 44c15-12 34-17 55-16 18 1 34 7 48 16" fill="none" stroke="rgba(255,132,188,.54)" stroke-width="7" stroke-linecap="round"/><path d="M28 49c13-9 30-13 47-12 15 1 29 5 42 12" fill="none" stroke="rgba(109,182,255,.48)" stroke-width="6" stroke-linecap="round"/><circle cx="44" cy="54" r="10" fill="rgba(255,255,255,.2)"/><circle cx="136" cy="60" r="8" fill="rgba(255,255,255,.16)"/>`;
      case 'magic-rich':
        return `<path d="M26 58c11-24 31-31 57-19-5 18-24 29-57 19z" fill="rgba(203,171,255,.24)"/><path d="M120 34l4 9 10 2-8 6 3 9-9-4-8 4 3-9-8-6 10-2z" fill="rgba(255,255,255,.38)"/><path d="M36 158c18-8 39-10 61-6 18 4 34 4 49 0" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="5" stroke-linecap="round"/>`;
      case 'moon-rich':
        return `<circle cx="42" cy="42" r="16" fill="rgba(255,244,178,.48)"/><circle cx="49" cy="38" r="14" fill="url(#bg-${card.id})" opacity=".95"/><text x="124" y="46" font-size="13" font-weight="700" fill="rgba(255,255,255,.54)">✶</text><path d="M24 160c20-9 40-10 61-6 20 3 40 3 61-2" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="5" stroke-linecap="round"/>`;
      case 'aurora-rich':
        return `<path d="M22 56c21-17 44-21 71-10" fill="none" stroke="rgba(110,232,198,.46)" stroke-width="8" stroke-linecap="round"/><path d="M30 72c19-10 39-13 61-7" fill="none" stroke="rgba(126,188,255,.4)" stroke-width="6" stroke-linecap="round"/><path d="M18 164c20-7 40-8 60-5 19 3 39 3 60-2v20H18z" fill="rgba(255,255,255,.08)"/>`;
      case 'sun-palace':
        return `<circle cx="40" cy="42" r="16" fill="rgba(255,225,124,.5)"/><path d="M22 160c20-8 42-9 65-5 18 4 37 3 57-1v22H22z" fill="rgba(255,228,156,.18)"/><path d="M54 44l10-10 10 10 10-10 10 10 10-10 10 10" fill="none" stroke="rgba(255,241,196,.42)" stroke-width="4" stroke-linecap="round"/><path d="M32 26c14-9 31-12 51-11 18 1 33 5 47 11" fill="none" stroke="rgba(255,243,210,.2)" stroke-width="4" stroke-linecap="round"/>`;
      case 'galaxy-rich':
        return `<circle cx="38" cy="38" r="6" fill="rgba(255,255,255,.62)"/><circle cx="54" cy="56" r="3" fill="rgba(255,214,115,.5)"/><circle cx="132" cy="40" r="15" fill="rgba(255,208,122,.18)"/><ellipse cx="132" cy="40" rx="22" ry="7" fill="none" stroke="rgba(255,234,183,.3)" stroke-width="3" transform="rotate(-16 132 40)"/><path d="M22 160c21-9 42-10 64-7 20 4 39 3 58-2" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="5" stroke-linecap="round"/>`;
      default:
        return '';
    }
  }

  function orbitShapes() {
    switch (deco.orbit) {
      case 'none':
        return ``;
      case 'leaf':
        return `<ellipse cx="42" cy="44" rx="12" ry="6" fill="rgba(126,214,156,.44)" transform="rotate(-24 42 44)"/><ellipse cx="124" cy="46" rx="11" ry="5" fill="rgba(255,152,184,.28)" transform="rotate(24 124 46)"/>`;
      case 'bubble':
        return `<circle cx="44" cy="46" r="8" fill="rgba(255,255,255,.36)"/><circle cx="124" cy="40" r="7" fill="rgba(255,255,255,.28)"/><circle cx="118" cy="56" r="4" fill="rgba(255,255,255,.24)"/>`;
      case 'mint':
        return `<path d="M36 54c10-13 18-16 29-13-7 11-16 16-29 13z" fill="rgba(124,231,199,.36)"/><path d="M126 38c7 9 8 16 2 24-8-4-11-10-2-24z" fill="rgba(110,205,255,.28)"/>`;
      case 'star':
        return `<path d="M40 48l4 8 8 2-6 5 2 8-8-4-7 4 2-8-6-5 8-2z" fill="rgba(255,239,143,.52)"/><circle cx="124" cy="44" r="6" fill="rgba(255,255,255,.24)"/>`;
      case 'heart':
        return `<path d="M42 52c-5-6 2-14 9-10 2 2 4 4 5 6 1-2 2-4 5-6 7-4 14 4 9 10-4 5-14 11-14 11s-10-6-14-11z" fill="rgba(255,145,189,.44)"/><circle cx="124" cy="46" r="5" fill="rgba(255,245,179,.24)"/>`;
      case 'rain':
        return `<path d="M42 38c7 9 8 15 0 22-8-7-7-13 0-22z" fill="rgba(120,210,255,.42)"/><path d="M124 42c5 7 6 13 0 18-6-5-5-11 0-18z" fill="rgba(168,154,255,.34)"/>`;
      case 'note':
        return `<text x="40" y="50" font-size="17" font-weight="700" fill="rgba(255,213,95,.62)">♪</text><text x="118" y="46" font-size="14" font-weight="700" fill="rgba(255,153,207,.52)">♫</text>`;
      case 'rainbow':
        return `<path d="M24 58c10-18 29-28 49-28 20 0 39 10 49 28" fill="none" stroke="rgba(255,124,176,.48)" stroke-width="6" stroke-linecap="round"/><path d="M30 62c9-12 25-19 43-19 18 0 34 7 43 19" fill="none" stroke="rgba(108,171,255,.42)" stroke-width="5" stroke-linecap="round"/>`;
      case 'magic':
        return `<path d="M34 62c8-24 26-31 48-19-3 17-20 27-48 19z" fill="rgba(201,165,255,.28)"/><text x="120" y="48" font-size="17" font-weight="700" fill="rgba(255,255,255,.66)">✦</text>`;
      case 'moon':
        return `<path d="M42 52c10-14 9-26 0-36 15 1 27 13 27 28 0 13-9 23-23 27 6-5 10-11 10-18 0-7-4-13-14-19z" fill="rgba(255,247,177,.48)"/><circle cx="126" cy="44" r="5" fill="rgba(255,255,255,.42)"/>`;
      case 'aurora':
        return `<path d="M28 58c20-18 44-22 73-10" fill="none" stroke="rgba(109,233,199,.42)" stroke-width="7" stroke-linecap="round"/><path d="M38 70c18-10 39-13 61-8" fill="none" stroke="rgba(126,188,255,.36)" stroke-width="5" stroke-linecap="round"/>`;
      case 'sun':
        return `<circle cx="38" cy="42" r="13" fill="rgba(255,222,112,.48)"/><g stroke="rgba(255,233,173,.62)" stroke-width="3" stroke-linecap="round"><path d="M38 18v8"/><path d="M38 58v8"/><path d="M14 42h8"/><path d="M54 42h8"/></g>`;
      case 'galaxy':
        return `<ellipse cx="40" cy="42" rx="19" ry="10" fill="none" stroke="rgba(255,221,120,.46)" stroke-width="3" transform="rotate(-20 40 42)"/><circle cx="126" cy="42" r="5" fill="rgba(255,255,255,.52)"/><circle cx="117" cy="56" r="3" fill="rgba(191,166,255,.46)"/>`;
      default:
        return '';
    }
  }

  function frameDeco() {
    switch (deco.frame) {
      case 'none':
        return ``;
      case 'bubbles':
        return `<circle cx="30" cy="166" r="6" fill="rgba(255,255,255,.28)"/><circle cx="136" cy="160" r="5" fill="rgba(255,255,255,.22)"/>`;
      case 'spark':
        return `<path d="M26 164l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="rgba(255,243,143,.44)"/>`;
      case 'ribbon':
        return `<path d="M126 156c11 2 15 10 14 24-11 1-20-8-14-24z" fill="rgba(255,162,206,.34)"/>`;
      case 'hearts':
        return `<path d="M124 170c-4-5 1-11 6-8 2 1 2 3 3 4 1-1 1-3 3-4 5-3 10 3 6 8-4 4-9 7-9 7s-5-3-9-7z" fill="rgba(255,181,208,.46)"/>`;
      case 'drops':
        return `<path d="M132 160c6 7 8 14 0 22-8-8-6-15 0-22z" fill="rgba(121,215,255,.34)"/>`;
      case 'notes':
        return `<text x="126" y="176" font-size="16" font-weight="700" fill="rgba(255,210,110,.56)">♫</text>`;
      case 'flare':
        return `<path d="M22 168c12-10 27-12 44-6" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="4" stroke-linecap="round"/><path d="M102 170c10-9 23-12 38-8" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="4" stroke-linecap="round"/>`;
      case 'gems':
        return `<path d="M26 162l10-8 10 8-10 16z" fill="rgba(255,255,255,.34)"/><path d="M122 162l10-8 10 8-10 16z" fill="rgba(255,210,252,.28)"/>`;
      case 'stars':
        return `<text x="24" y="174" font-size="15" font-weight="700" fill="rgba(255,255,255,.62)">✦</text><text x="126" y="164" font-size="12" font-weight="700" fill="rgba(255,233,156,.58)">✶</text>`;
      case 'aurora':
        return `<path d="M18 170c20-10 40-10 60 0" fill="none" stroke="rgba(109,233,199,.4)" stroke-width="4" stroke-linecap="round"/><path d="M94 170c14-9 28-10 42-2" fill="none" stroke="rgba(126,188,255,.36)" stroke-width="4" stroke-linecap="round"/>`;
      case 'royal':
        return `<path d="M20 170c26-18 48-18 72 0" fill="none" stroke="rgba(255,223,123,.56)" stroke-width="5" stroke-linecap="round"/><circle cx="132" cy="168" r="6" fill="rgba(255,238,186,.56)"/>`;
      case 'cosmic':
        return `<ellipse cx="40" cy="168" rx="18" ry="8" fill="none" stroke="rgba(255,214,115,.5)" stroke-width="3" transform="rotate(-15 40 168)"/><circle cx="128" cy="168" r="4" fill="rgba(255,255,255,.56)"/>`;
      default:
        return `<circle cx="28" cy="170" r="4" fill="rgba(255,255,255,.28)"/><circle cx="132" cy="164" r="4" fill="rgba(255,255,255,.22)"/>`;
    }
  }

  function pedestalMarkup() {
    switch (deco.pedestal) {
      case 'rainbow-band':
        return `<g opacity=".9"><path d="M10 150c12-9 28-14 48-14 20 0 36 5 48 14" fill="none" stroke="rgba(255,122,179,.58)" stroke-width="7" stroke-linecap="round"/><path d="M16 154c10-6 24-10 42-10 18 0 32 4 42 10" fill="none" stroke="rgba(111,181,255,.54)" stroke-width="5" stroke-linecap="round"/></g>`;
      case 'magic-band':
        return `<g opacity=".9"><rect x="14" y="138" width="88" height="18" rx="9" fill="rgba(177,134,255,.34)"/><path d="M22 147h72" stroke="rgba(255,232,171,.5)" stroke-width="3" stroke-linecap="round"/><text x="58" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="rgba(255,255,255,.74)">✦</text></g>`;
      case 'moon-band':
        return `<g opacity=".92"><path d="M24 148c10-8 22-12 34-12 14 0 25 5 34 14" fill="rgba(255,245,177,.26)"/><path d="M36 146c12-5 24-5 36 0" fill="none" stroke="rgba(255,255,255,.44)" stroke-width="4" stroke-linecap="round"/></g>`;
      case 'aurora-band':
        return `<g opacity=".9"><path d="M12 150c17-8 33-10 50-8 14 2 29 1 46-3" fill="none" stroke="rgba(109,233,199,.56)" stroke-width="6" stroke-linecap="round"/><path d="M16 156c14-5 29-7 45-5 12 2 25 1 38-2" fill="none" stroke="rgba(126,188,255,.48)" stroke-width="4" stroke-linecap="round"/></g>`;
      case 'sun-band':
        return `<g opacity=".92"><ellipse cx="34" cy="148" rx="18" ry="8" fill="rgba(255,246,204,.72)"/><ellipse cx="58" cy="144" rx="28" ry="10" fill="rgba(255,240,184,.68)"/><ellipse cx="84" cy="148" rx="18" ry="7" fill="rgba(255,235,176,.62)"/></g>`;
      case 'comet-band':
        return `<g opacity=".92"><ellipse cx="58" cy="148" rx="42" ry="11" fill="rgba(143,121,255,.22)"/><ellipse cx="58" cy="148" rx="52" ry="15" fill="none" stroke="rgba(255,223,123,.38)" stroke-width="4" transform="rotate(-10 58 148)"/></g>`;
      default:
        return '';
    }
  }

  function headpieceMarkup() {
    switch (deco.headpiece) {
      case 'sun-tiara':
        return `<path d="M76 22l7-8 8 6 8-8 8 8" fill="none" stroke="rgba(255,244,194,.94)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="91" cy="20" r="4" fill="rgba(255,232,150,.94)"/>`;
      case 'star-circlet':
        return `<path d="M76 24c7-7 16-11 27-11 10 0 19 4 26 11" fill="none" stroke="rgba(255,239,203,.88)" stroke-width="4" stroke-linecap="round"/><text x="101" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="rgba(255,255,255,.94)">✦</text>`;
      default:
        return '';
    }
  }

  function tailMarkup() {
    switch (deco.tail) {
      case 'royal-tail':
        return `<path d="M28 116c-18 8-28 24-24 39 4 14 17 22 35 22-12-5-18-11-18-19 11 3 22-1 30-10-15-2-22-11-23-32z" fill="url(#mane-${card.id})" opacity=".98"/><path d="M14 138c8 6 16 8 24 7" fill="none" stroke="rgba(255,233,162,.58)" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="152" r="2.5" fill="rgba(255,242,201,.72)"/>`;
      case 'galaxy-tail':
        return `<path d="M26 112c-20 7-31 24-27 42 4 17 18 27 38 27-13-6-19-14-18-23 12 5 24 2 34-8-17-3-24-13-27-38z" fill="url(#mane-${card.id})" opacity="1"/><circle cx="10" cy="144" r="3" fill="rgba(255,255,255,.62)"/><circle cx="20" cy="160" r="2" fill="rgba(255,223,123,.58)"/><path d="M18 134c8 3 14 3 20 0" fill="none" stroke="rgba(188,176,255,.5)" stroke-width="2.5" stroke-linecap="round"/>`;
      default:
        return `<path d="M30 118c-18 8-27 22-24 37 4 14 16 21 32 21-10-5-16-10-16-18 11 3 21 0 28-8-14-2-20-10-20-32z" fill="url(#mane-${card.id})" opacity=".95"/>`;
    }
  }

  const aura = rarity === 'SSR'
    ? '<circle cx="90" cy="92" r="58" fill="rgba(255,231,160,.26)"/><circle cx="90" cy="92" r="70" fill="none" stroke="rgba(255,240,205,.42)" stroke-width="3" stroke-dasharray="10 8"/>'
    : rarity === 'SR'
      ? '<circle cx="90" cy="94" r="50" fill="rgba(255,255,255,.2)"/><circle cx="90" cy="94" r="60" fill="none" stroke="rgba(255,255,255,.24)" stroke-width="2.5" stroke-dasharray="8 7"/>'
      : '<circle cx="90" cy="98" r="44" fill="rgba(255,255,255,.12)"/>';
  const forelock = '<path d="M72 20l8-18 8 17" fill="none" stroke="#ffe9b8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';

  return `
    <svg viewBox="0 0 180 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bg-${card.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c.a}"/>
          <stop offset="55%" stop-color="${c.b}"/>
          <stop offset="100%" stop-color="${c.c}"/>
        </linearGradient>
        <linearGradient id="mane-${card.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c.mane1}"/>
          <stop offset="100%" stop-color="${c.mane2}"/>
        </linearGradient>
      </defs>
      <rect x="14" y="12" width="152" height="186" rx="28" fill="url(#bg-${card.id})" opacity=".92"/>
      ${backdrop()}
      ${aura}
      ${orbitShapes()}
      ${frameDeco()}
      <g transform="translate(32 18)">
        <ellipse cx="58" cy="152" rx="52" ry="16" fill="rgba(255,255,255,.16)"/>
        ${pedestalMarkup()}
        ${tailMarkup()}
        <path d="M81 89c20-18 27-44 23-61-22 5-44 20-54 41 4 11 15 18 31 20z" fill="rgba(255,255,255,.28)"/>
        <path d="M45 145c-19 0-33-12-38-28l-8-35c-3-11 3-23 15-27l54-12c17-4 35 4 43 20l11 21c12 23-3 52-29 55l-48 6z" fill="${c.body}"/>
        <ellipse cx="65" cy="118" rx="28" ry="17" fill="rgba(255,255,255,.1)"/>
        <path d="M88 38c19 4 34 19 35 39 1 20-11 38-31 43-21 6-42-6-49-26-6-20 1-41 20-49 8-4 16-6 25-7z" fill="${c.body}"/>
        ${forelock}
        ${headpieceMarkup()}
        <path d="M118 55c-8-20-25-33-52-38 5 13 1 24-7 34 13 9 35 14 59 4z" fill="url(#mane-${card.id})"/>
        <path d="M64 84c-15 14-20 31-16 52 17-8 33-5 43 6 5-18 1-39-27-58z" fill="url(#mane-${card.id})"/>
        <circle cx="90" cy="70" r="7.5" fill="#4d4269"/>
        <circle cx="92.5" cy="67.5" r="2.2" fill="#fff"/>
        <path d="M103 82c7 5 12 5 18 0" fill="none" stroke="#f07aa8" stroke-width="4" stroke-linecap="round"/>
        <g transform="translate(50 108)">
          <path d="M0-15l4 8 9 2-7 7 2 10-8-5-9 5 3-10-7-7 9-2z" fill="#ffd968"/>
          <circle cx="25" cy="2" r="17" fill="rgba(255,255,255,.18)"/>
          <text x="25" y="7" text-anchor="middle" font-size="20" font-weight="700" fill="#fff8ff">${deco.icon}</text>
        </g>
      </g>
    </svg>`;
}




  window.CARD_DATA = Object.freeze({
    CARD_POOL: Object.freeze(CARD_POOL),
    CARD_ARTWORK: Object.freeze(CARD_ARTWORK),
    rarityClass,
    buildPonySvg,
    getCard
  });
})();
