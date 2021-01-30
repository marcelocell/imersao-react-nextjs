import QuizScreen from '../../src/screens/Quiz'
import { ThemeProvider } from 'styled-components'

export default function QuizDaGaleraPage({ externalDb }) {
  return (
    <ThemeProvider theme={externalDb.theme}>
      <QuizScreen db={externalDb} />
    </ThemeProvider>
  )
}


export async function getServerSideProps(context) {
  const [projectName, gitHubUser] = context.query.id.split('___')
  const projectUrl = `https://${projectName}.${gitHubUser}.vercel.app`
  
  try {
    /*global fetch*/
    const externalDb = await fetch(`${projectUrl}/api/db`)
      .then((result) => {
        if (result.ok) {
          return result.json()
        }
        throw new Error('Falha ao acessar o servidor')
      })
    
    externalDb.questions.forEach(question => {
      if (question.sound)
        question.sound = projectUrl + question.sound
    })
    
    return {
      props: {
        externalDb,
      },
    }
  } catch (err) {
    console.error(err)
  }
}

