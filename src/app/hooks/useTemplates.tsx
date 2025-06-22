
import { useState, useEffect } from 'react';
import { useToast } from '@/app/hooks/use-toast';

export const useTemplates = (groupId?: string) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (groupId) {
      fetchTemplates();
      fetchCategories();
    }
  }, [groupId]);

  const fetchTemplates = async () => {
    try {
      console.log(`Mock API: Fetching templates for group ${groupId}`);
      
      // Simulate API call that would fetch templates from backend
      // In a real implementation, this would be:
      // const response = await axios.get(`/api/groups/${groupId}/templates`);
      
      const mockTemplates = [
        {
          id: '1',
          display_name: 'משמרת בוקר',
          shift_type: 'שמירה',
          start_time: '08:00',
          end_time: '14:00',
          default_duration: 6,
          points: 1.2,
          included_user_categories: ['cat1', 'cat2'],
          excluded_user_categories: ['cat3'],
          description: 'משמרת בוקר רגילה',
          color: '#3b82f6',
          most_used: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          display_name: 'תורנות לילה',
          shift_type: 'תורנות',
          start_time: '22:00',
          end_time: '06:00',
          default_duration: 8,
          points: 2.0,
          included_user_categories: ['cat1'],
          excluded_user_categories: ['cat2', 'cat3'],
          description: 'תורנות לילה קשה',
          color: '#7c3aed',
          most_used: false,
          created_at: new Date().toISOString()
        }
      ];

      console.log('Mock API: Templates fetched successfully', mockTemplates);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Mock API: Error fetching templates:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לטעון את התבניות',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Mock API: Fetching user categories');
      
      // Simulate API call that would fetch categories from backend
      // In a real implementation, this would be:
      // const response = await axios.get('/api/user-categories');
      
      const mockCategories = [
        { id: 'cat1', display_name: 'יכול לעבוד בלילה' },
        { id: 'cat2', display_name: 'הרשאת נשק' },
        { id: 'cat3', display_name: 'קבע' },
        { id: 'cat4', display_name: 'יכול להרים כבד' }
      ];

      console.log('Mock API: Categories fetched successfully', mockCategories);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Mock API: Error fetching categories:', error);
    }
  };

  const createTemplate = async (templateData: any) => {
    try {
      console.log('Mock API: Creating template', templateData);
      
      // Simulate API call that would create template in backend
      // In a real implementation, this would be:
      // const response = await axios.post(`/api/groups/${groupId}/templates`, templateData);

      const newTemplate = {
        ...templateData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        most_used: false
      };

      console.log('Mock API: Template created successfully', newTemplate);
      setTemplates(prev => [newTemplate, ...prev]);

      toast({
        title: 'הצלחה',
        description: 'התבנית נוצרה בהצלחה'
      });

      return newTemplate;
    } catch (error) {
      console.error('Mock API: Error creating template:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו ליצור את התבנית',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateTemplate = async (templateId: string, templateData: any) => {
    try {
      console.log(`Mock API: Updating template ${templateId}`, templateData);
      
      // Simulate API call that would update template in backend
      // In a real implementation, this would be:
      // const response = await axios.put(`/api/templates/${templateId}`, templateData);

      setTemplates(prev => 
        prev.map(template => 
          template.id === templateId 
            ? { ...template, ...templateData }
            : template
        )
      );

      console.log('Mock API: Template updated successfully');
      toast({
        title: 'הצלחה',
        description: 'התבנית עודכנה בהצלחה'
      });

      return templateData;
    } catch (error) {
      console.error('Mock API: Error updating template:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לעדכן את התבנית',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      console.log(`Mock API: Deleting template ${templateId}`);
      
      // Simulate API call that would delete template from backend
      // In a real implementation, this would be:
      // await axios.delete(`/api/templates/${templateId}`);

      setTemplates(prev => prev.filter(template => template.id !== templateId));

      console.log('Mock API: Template deleted successfully');
      toast({
        title: 'הצלחה',
        description: 'התבנית נמחקה בהצלחה'
      });
    } catch (error) {
      console.error('Mock API: Error deleting template:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו למחוק את התבנית',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    templates,
    categories,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};
