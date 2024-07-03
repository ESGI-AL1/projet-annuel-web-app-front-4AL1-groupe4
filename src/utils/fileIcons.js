import { FaJs, FaPython, FaJava, FaHtml5, FaCss3Alt, FaReact, FaPhp, FaSwift, FaRust, FaFileAlt, FaFileCode, FaFilePdf } from 'react-icons/fa';
import { SiCplusplus, SiGoland, SiTypescript, SiRuby, SiKotlin, SiPowershell, SiPerl, SiLua, SiScala, SiDart, SiR, SiMysql, SiPostgresql, SiSqlite, SiGraphql, SiTerraform, SiDocker, SiHaskell, SiErlang, SiElixir, SiElm, SiFsharp, SiGroovy, SiMarkdown, SiLatex, SiYaml } from 'react-icons/si';

const fileIcons = {
    '.js': <FaJs />,
    '.py': <FaPython />,
    '.cpp': <SiCplusplus />,
    '.go': <SiGoland />,
    '.java': <FaJava />,
    '.c': <SiCplusplus />,
    '.cs': <FaFileCode />,
    '.rb': <SiRuby />,
    '.php': <FaPhp />,
    '.html': <FaHtml5 />,
    '.css': <FaCss3Alt />,
    '.ts': <SiTypescript />,
    '.jsx': <FaReact />,
    '.tsx': <FaReact />,
    '.swift': <FaSwift />,
    '.kt': <SiKotlin />,
    '.rs': <FaRust />,
    '.sh': <SiPowershell />,
    '.pl': <SiPerl />,
    '.r': <SiR />,
    '.m': <FaFileCode />,
    '.vb': <FaFileCode />,
    '.scala': <SiScala />,
    '.dart': <SiDart />,
    '.lua': <SiLua />,
    '.sql': <SiMysql />,
    '.yaml': <SiYaml />,
    '.xml': <FaFileCode />,
    '.json': <FaFileCode />,
    '.bat': <SiPowershell />,
    '.h': <FaFileCode />,
    '.scss': <FaFileCode />,
    '.less': <FaFileCode />,
    '.coffee': <FaFileCode />,
    '.md': <SiMarkdown />,
    '.ps1': <SiPowershell />,
    '.erl': <SiErlang />,
    '.hs': <SiHaskell />,
    '.lisp': <FaFileCode />,
    '.clj': <FaFileCode />,
    '.ml': <FaFileCode />,
    '.fs': <SiFsharp />,
    '.elm': <SiElm />,
    '.tf': <SiTerraform />,
    '.dockerfile': <SiDocker />,
    '.ipynb': <FaFileAlt />,
    '.pgsql': <SiPostgresql />,
    '.sqlite': <SiSqlite />,
    '.graphql': <SiGraphql />,
    '.latex': <SiLatex />,
    '.pdf': <FaFilePdf />,
};

export default fileIcons;
