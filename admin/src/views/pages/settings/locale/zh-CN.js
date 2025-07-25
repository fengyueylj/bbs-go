export default {
  settings: {
    common: {
      title: '通用配置',
      siteTitle: '网站名称',
      siteLogo: '网站LOGO',
      siteDescription: '网站描述',
      siteKeywords: '网站关键字',
      siteNotification: '网站公告',
      recommendTags: '推荐标签',
      defaultNodeId: '默认节点',
      modules: '功能模块',
      tweet: '动态',
      topic: '帖子',
      article: '文章',
      urlRedirect: '站外链接跳转页面',
      urlRedirectTooltip: '在跳转前需手动确认是否前往该站外链接',
      enableHideContent: '启用评论可见内容',
      enableHideContentTooltip: '发帖时支持设置评论后可见内容',
      submit: '提交',
      placeholder: {
        siteTitle: '网站名称',
        siteDescription: '网站描述',
        siteKeywords: '网站关键字',
        siteNotification: '网站公告（支持输入HTML）',
        recommendTags: '推荐标签',
        defaultNodeId: '发帖默认节点',
      },
      message: {
        submitSuccess: '提交成功',
      },
    },
    nav: {
      title: '导航配置',
      tableTitle: '标题',
      tableUrl: '链接',
      submit: '提交',
      message: {
        validation: '请检查你的导航配置，导航标题和链接不能为空',
        submitSuccess: '提交成功',
      },
    },
    score: {
      title: '积分配置',
      postTopicScore: '发帖积分',
      postCommentScore: '跟帖积分',
      checkInScore: '签到积分',
      submit: '提交',
      placeholder: {
        postTopicScore: '发帖获得积分',
        postCommentScore: '跟帖获得积分',
        checkInScore: '签到获得积分',
      },
      message: {
        submitSuccess: '提交成功',
      },
    },
    spam: {
      title: '反作弊配置',
      topicCaptcha: '发帖验证码',
      topicCaptchaTooltip: '发帖时是否开启验证码校验',
      createTopicEmailVerified: '邮箱验证后发帖',
      createTopicEmailVerifiedTooltip: '需要验证邮箱后才能发帖',
      createArticleEmailVerified: '邮箱验证后发表文章',
      createArticleEmailVerifiedTooltip: '需要验证邮箱后才能发表文章',
      createCommentEmailVerified: '邮箱验证后评论',
      createCommentEmailVerifiedTooltip: '需要验证邮箱后才能发表评论',
      articlePending: '发表文章审核',
      articlePendingTooltip: '发布文章后是否开启审核',
      userObserveSeconds: '用户观察期(秒)',
      userObserveSecondsTooltip:
        '观察期内用户无法发表话题、动态等内容，设置为 0 表示无观察期。',
      emailWhitelist: '邮箱白名单',
      submit: '提交',
      placeholder: {
        emailWhitelist: '邮箱白名单',
      },
      message: {
        submitSuccess: '提交成功',
      },
    },
    upload: {
      title: '上传配置',
      uploadConfig: '上传配置',
      enableUploadMethod: '启用上传方式',
      aliyunOss: '阿里云OSS',
      tencentCos: '腾讯云COS',
      host: '域名',
      bucket: 'Bucket',
      endpoint: 'Endpoint',
      accessKeyId: 'AccessKey ID',
      accessKeySecret: 'AccessKey Secret',
      region: '地域',
      secretId: 'SecretId',
      secretKey: 'SecretKey',
      imageStyleConfig: '图片样式配置',
      styleSplitter: '样式分隔符',
      styleAvatar: '头像样式',
      stylePreview: '预览样式',
      styleSmall: '小图样式',
      styleDetail: '详情样式',
      submit: '提交',
      placeholder: {
        host: '请输入OSS域名，如：https://xxx.oss-cn-beijing.aliyuncs.com/',
        bucket: '请输入Bucket名称',
        endpoint: '请输入Endpoint，如：oss-cn-beijing.aliyuncs.com',
        accessKeyId: '请输入AccessKey ID',
        accessKeySecret: '请输入AccessKey Secret',
        tencentBucket: '请输入Bucket名称，格式：bucket-appid',
        region: '请输入地域，如：ap-beijing',
        secretId: '请输入SecretId',
        secretKey: '请输入SecretKey',
        styleSplitter: '样式分隔符，如：!',
        styleAvatar: '头像样式，如：100x100',
        stylePreview: '预览样式，如：400x400',
        styleSmall: '小图样式，如：200x200',
        styleDetail: '详情样式，如：800x800',
      },
      message: {
        submitSuccess: '提交成功',
      },
    },
  },
};
