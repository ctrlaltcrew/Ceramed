import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: 'Breakthrough in Natural Compound Research: New Discoveries in Plant-Based Therapeutics',
      excerpt: 'Our latest research reveals promising therapeutic compounds extracted from indigenous Pakistani plants, showing significant potential for treating inflammatory conditions.',
      author: 'Dr. Sarah Ahmed',
      date: 'March 15, 2024',
      readTime: '5 min read',
      category: 'Research',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=400&fit=crop&crop=center',
    },
    {
      title: 'Advancing Preclinical Testing Methods: Innovation in Safety Assessment Protocols',
      excerpt: 'We explore cutting-edge methodologies that enhance the accuracy and efficiency of preclinical studies, reducing time-to-market for new treatments.',
      author: 'Dr. Muhammad Hassan',
      date: 'March 8, 2024',
      readTime: '7 min read',
      category: 'Innovation',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop&crop=center',
    },
    {
      title: 'The Future of Personalized Medicine: How Biochemical Testing is Transforming Healthcare',
      excerpt: 'Discover how advanced biochemical testing techniques are paving the way for personalized treatment approaches and improved patient outcomes.',
      author: 'Dr. Fatima Khan',
      date: 'February 28, 2024',
      readTime: '6 min read',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop&crop=center',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Research: 'bg-primary text-primary-foreground',
      Innovation: 'bg-secondary text-secondary-foreground', 
      Healthcare: 'bg-accent text-accent-foreground',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <section id="blog" className="section-padding bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-6">
            Latest Insights
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Research Updates & 
            <span className="text-secondary"> Discoveries</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay informed about the latest developments in biomedical research, 
            breakthrough discoveries, and innovations from our expert team.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post, index) => (
            <article 
              key={index}
              className="medical-card group hover:bg-gradient-card animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Post Image */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
              </div>

              {/* Post Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Post Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>

                {/* Read More */}
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-secondary group/btn">
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <Button className="btn-medical text-lg group">
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;