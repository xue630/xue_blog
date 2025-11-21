import MarkdownIt from "markdown-it";
import markdownItAnchor from 'markdown-it-anchor';


export const md = new MarkdownIt({
    html:true,         // 允许 HTML 标签
    linkify:true,      // 自动转换链接
    typographer: true, // 美化排版
    breaks: true ,      // 换行转换为 <br>
    quotes: '“”‘’'
}).use(markdownItAnchor, {
    level: [1, 2, 3,4,5],
    slugify: generateId,
    // permalink: markdownItAnchor.permalink.headerLink()
    permalink:false
});


function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function catalogue(text){//传入md文本流

    
    // const md = new MarkdownIt();
    md.enable('table');
    const tokens = md.parse(text,{});

    // 提取标题和生成目录
    const catalog = [];
    tokens.forEach((token) => {
  if (token.type === 'heading_open') {
    const level = parseInt(token.tag.substr(1)) // h1 -> 1, h2 -> 2
    const contentToken = tokens[tokens.indexOf(token) + 1]
    
    if (contentToken && contentToken.type === 'inline') {
      catalog.push({
        level: level,
        text: contentToken.content,
        id: generateId(contentToken.content)
      })
    }
  }
})
    return catalog;
}