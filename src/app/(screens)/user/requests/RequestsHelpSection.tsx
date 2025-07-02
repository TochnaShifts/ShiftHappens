import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Brain } from "lucide-react";

export const RequestsHelpSection = () => {
  return (
    <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 ml-2 text-purple-600" />
              איך מערכת הבקשות עובדת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">לא יכול לעבוד (הרחקה)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• המערכת תנסה לא להקצות לך משמרות בתאריכים אלה</li>
                  <li>• חשוב לדווח מראש כאשר ניתן</li>
                  <li>• בקשות חירום יטופלו בהתאם לאפשרות</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">מעוניין לעבוד</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• המערכת תעדיף להקצות לך משמרות בתאריכים אלה</li>
                  <li>• עוזר באיזון העומס בין חברי הצוות</li>
                  <li>• לא מבטיח הקצאה - תלוי בצרכים הכלליים</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Brain className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800 font-medium">
                  המערכת מביאה בחשבון את כל הבקשות יחד עם נקודות, זמינות כללית, ודרישות התפקיד
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
  );
};
