export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getQuizById(id).then(data => {
        setQuiz(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse">Carregando...</div>;
  if (!quiz) return <div className="p-20 text-center text-error">Quiz não encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-lg">
            <img src={quiz.imageUrl || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&q=80'} alt={quiz.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="flex gap-2 mb-4">
                <span className="bg-primary-base/80 backdrop-blur text-xs font-bold px-3 py-1 rounded border border-white/20 uppercase">
                  {quiz.category}
                </span>
                <span className="bg-black/60 backdrop-blur text-xs font-bold px-3 py-1 rounded border border-white/20 uppercase">
                  {quiz.difficulty}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{quiz.title}</h1>
              <p className="text-lg text-white/80 line-clamp-2">{quiz.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to={`/quiz/${quiz.id}/play`} className="flex-1">
              <Button size="lg" className="w-full text-lg h-14 bg-success shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:opacity-90">
                <Play className="mr-2 h-6 w-6 fill-current" /> Jogar Agora
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="h-14 w-14 p-0 shrink-0">
              <Share2 size={24} />
            </Button>
            <Button variant="secondary" size="lg" className="h-14 w-14 p-0 shrink-0 bg-error/10 text-error border-error/20 hover:bg-error/20">
              <Heart size={24} className="fill-current" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="text-primary-light" /> Comentários (0)
              </h3>
              <div className="text-center py-8 text-text-dim">
                Nenhum comentário ainda. Seja o primeiro a compartilhar seus pensamentos!
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm text-text-dim mb-1">Criado por</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-base/20 flex items-center justify-center font-bold text-primary-light text-lg">
                    {quiz.author.name.charAt(0)}
                  </div>
                  <span className="font-bold text-text-white">{quiz.author.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-darker p-4 rounded-xl border border-white/5">
                  <Star className="text-yellow-500 mb-2 h-6 w-6" />
                  <div className="font-bold text-2xl">{quiz.rating}</div>
                  <div className="text-xs text-text-dim">Avaliação</div>
                </div>
                <div className="bg-surface-darker p-4 rounded-xl border border-white/5">
                  <Play className="text-blue-400 mb-2 h-6 w-6" />
                  <div className="font-bold text-2xl">{quiz.playCount}</div>
                  <div className="text-xs text-text-dim">Partidas</div>
                </div>
                <div className="bg-surface-darker p-4 rounded-xl border border-white/5 col-span-2">
                  <AlertCircle className="text-purple-400 mb-2 h-6 w-6" />
                  <div className="font-bold text-2xl">{quiz.questionsCount}</div>
                  <div className="text-xs text-text-dim">Questões</div>
                </div>
              </div>

              <div>
                <p className="text-sm text-text-dim mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {quiz.tags.map(tag => (
                    <span key={tag} className="bg-white/5 px-2.5 py-1 rounded-md text-xs border border-white/10 text-text-white/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
