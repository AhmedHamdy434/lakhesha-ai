export const parseSection = (section: string) => {
  const [title, ...content] = section.split("\n");
  const cleanedTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();
  const points: String[] = [];
  let currentPoint = "";

  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("●")) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = "";
    } else {
      currentPoint += " " + trimmedLine;
    }
  });
  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanedTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
    ) as string[],
  };
};

// function to parse the point
export const parsePoint = (point: string) => {
  const isNumbered = /^d+\./.test(point);
  const isMainPoint = /^●/.test(point);
  // Replace the Unicode property escape with a simpler emoji detection

  const emojiRegex = /[\u{1F300}-\u{1F9FF}|\u{2600}-\u{26FF}]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();
  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}


// function to parse the point
export const parseEmojiPoint = (content: string) => {
  const cleanContent = content.replace(/^[●]\s*/, "").trim();

  const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  if (!matches) return null;
  const [ emoji, text] = matches.slice(1);
  return { emoji: emoji.trim(), text: text.trim() };
}

