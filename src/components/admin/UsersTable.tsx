import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/runtimeClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserData {
  email: string;
  business_name: string;
  business_idea: string;
  selected_blocks: string[];
  status: string;
  created_at: string;
  logo_count: number;
}

export function UsersTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const businessQuery = await supabase
        .from("user_businesses")
        .select("business_name, business_idea, selected_blocks, status, created_at, user_id, profiles!inner(email)")
        .order("created_at", { ascending: false });

      if (businessQuery.error) throw businessQuery.error;

      // Get logo counts for each user
      const userIds = businessQuery.data?.map((u: any) => u.user_id) || [];
      
      const logoQuery = await (supabase as any)
        .from("logo_generation_sessions")
        .select("user_id")
        .in("user_id", userIds);

      const logoCounts = logoQuery.data?.reduce((acc: any, session: any) => {
        acc[session.user_id] = (acc[session.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const formattedUsers = businessQuery.data?.map((user: any) => ({
        email: user.profiles.email,
        business_name: user.business_name,
        business_idea: user.business_idea,
        selected_blocks: user.selected_blocks || [],
        status: user.status,
        created_at: user.created_at,
        logo_count: logoCounts[user.user_id] || 0,
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Business Idea</TableHead>
                <TableHead>Blocks</TableHead>
                <TableHead>Logos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.business_name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {user.business_idea}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.selected_blocks.length} blocks
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.logo_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "launched" ? "default" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
